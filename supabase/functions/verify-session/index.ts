import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const STRIPE_API_KEY = Deno.env.get("STRIPE_API_KEY")!;

const ALLOWED_ORIGINS = [
  "https://www.eatslowcarb.com",
  "https://eatslowcarb.com",
  "https://slowcarb-new.vercel.app",
];

function getCorsOrigin(req: Request): string {
  const origin = req.headers.get("Origin") || "";
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

function corsHeaders(req: Request): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": getCorsOrigin(req),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(req) });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { session_id } = await req.json();

    if (!session_id || typeof session_id !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing session_id" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders(req) },
        }
      );
    }

    // Fetch checkout session from Stripe
    const stripeRes = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${session_id}`,
      {
        headers: {
          Authorization: `Bearer ${STRIPE_API_KEY}`,
        },
      }
    );

    if (!stripeRes.ok) {
      return new Response(
        JSON.stringify({ error: "Invalid session" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders(req) },
        }
      );
    }

    const session = await stripeRes.json();
    const email =
      session.customer_email || session.customer_details?.email;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "No email found in session" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders(req) },
        }
      );
    }

    return new Response(JSON.stringify({ email }), {
      headers: { "Content-Type": "application/json", ...corsHeaders(req) },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders(req) },
      }
    );
  }
});
