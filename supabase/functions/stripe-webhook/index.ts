import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = Deno.env.get("SITE_URL") || "https://www.eatslowcarb.com";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string
): Promise<boolean> {
  const parts = sigHeader.split(",");
  const timestamp = parts.find((p) => p.startsWith("t="))?.slice(2);
  const signature = parts.find((p) => p.startsWith("v1="))?.slice(3);
  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signedPayload)
  );
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Timing-safe comparison
  if (computed.length !== signature.length) return false;
  let result = 0;
  for (let i = 0; i < computed.length; i++) {
    result |= computed.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return result === 0;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const body = await req.text();
  const sigHeader = req.headers.get("stripe-signature");
  if (!sigHeader) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const valid = await verifyStripeSignature(
    body,
    sigHeader,
    STRIPE_WEBHOOK_SECRET
  );
  if (!valid) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.type !== "checkout.session.completed") {
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = event.data.object;
  const customerEmail =
    session.customer_email || session.customer_details?.email;
  if (!customerEmail) {
    console.error("No customer email in checkout session", session.id);
    return new Response("No customer email", { status: 400 });
  }

  // Check if Supabase auth user exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(
    (u) => u.email?.toLowerCase() === customerEmail.toLowerCase()
  );

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;
  } else {
    // Create new user with confirmed email
    const { data: newUser, error: createError } =
      await supabase.auth.admin.createUser({
        email: customerEmail,
        email_confirm: true,
      });
    if (createError || !newUser.user) {
      console.error("Failed to create user", createError);
      return new Response("Failed to create user", { status: 500 });
    }
    userId = newUser.user.id;
  }

  // Insert purchase record
  const { error: insertError } = await supabase.from("purchases").insert({
    user_id: userId,
    stripe_checkout_session_id: session.id,
    stripe_customer_email: customerEmail,
    status: "active",
  });

  if (insertError) {
    console.error("Failed to insert purchase", insertError);
    // Don't fail the webhook — user is created, purchase insert can be retried
  }

  // Generate magic link for the user
  const { error: linkError } =
    await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: customerEmail,
      options: { redirectTo: `${SITE_URL}/?app=1` },
    });

  if (linkError) {
    console.error("Failed to generate magic link", linkError);
  }

  return new Response(JSON.stringify({ received: true, userId }), {
    headers: { "Content-Type": "application/json" },
  });
});
