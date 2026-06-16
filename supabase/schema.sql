create table if not exists app_user (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists wealth_profile (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  age_range text,
  city text,
  job text,
  marital_status text,
  children text,
  total_asset numeric(14,2) not null default 0,
  total_debt numeric(14,2) not null default 0,
  monthly_income numeric(14,2) not null default 0,
  monthly_expense numeric(14,2) not null default 0,
  confidence integer not null default 60,
  risk_level text,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists money_item (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id text not null references wealth_profile(id) on delete cascade,
  category text not null check (category in ('asset','debt','income','expense')),
  name text not null,
  amount numeric(14,2) not null default 0,
  ratio numeric(6,2),
  confidence integer not null default 60,
  duration text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clue (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id text not null references wealth_profile(id) on delete cascade,
  content text not null,
  type text not null,
  confidence text not null default 'medium',
  confirmed boolean not null default false,
  hidden boolean not null default false,
  parsed_result jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists wealth_snapshot (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id text not null references wealth_profile(id) on delete cascade,
  total_asset numeric(14,2) not null default 0,
  total_debt numeric(14,2) not null default 0,
  monthly_income numeric(14,2) not null default 0,
  monthly_expense numeric(14,2) not null default 0,
  confidence integer not null default 60,
  created_at timestamptz not null default now()
);

alter table wealth_profile enable row level security;
alter table money_item enable row level security;
alter table clue enable row level security;
alter table wealth_snapshot enable row level security;

create policy "Users can manage own profiles" on wealth_profile
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own money items" on money_item
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own clues" on clue
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own snapshots" on wealth_snapshot
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_profile_user on wealth_profile(user_id);
create index if not exists idx_money_item_user_profile on money_item(user_id, profile_id);
create index if not exists idx_clue_user_profile on clue(user_id, profile_id);
create index if not exists idx_snapshot_user_profile on wealth_snapshot(user_id, profile_id);
