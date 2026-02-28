create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_checkout_session_id text unique,
  stripe_customer_email text not null,
  status text default 'active',
  purchased_at timestamptz default now()
);

alter table public.purchases enable row level security;

create policy "Users read own purchases"
  on public.purchases for select to authenticated
  using ((select auth.uid()) = user_id);
