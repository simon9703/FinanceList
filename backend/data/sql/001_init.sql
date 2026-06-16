-- AI 财富观察档案初始化 SQL
-- 每张业务表都包含 user_id，确保每个用户的数据独立存储。

create table if not exists app_user (
  id text primary key,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists wealth_profile (
  id text primary key,
  user_id text not null references app_user(id),
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
  user_id text not null references app_user(id),
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
  user_id text not null references app_user(id),
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

create table if not exists judgment_change (
  id text primary key,
  user_id text not null references app_user(id),
  profile_id text not null references wealth_profile(id) on delete cascade,
  label text not null,
  before_value text,
  after_value text not null,
  source text not null,
  created_at timestamptz not null default now()
);

create table if not exists wealth_snapshot (
  id text primary key,
  user_id text not null references app_user(id),
  profile_id text not null references wealth_profile(id) on delete cascade,
  total_asset numeric(14,2) not null default 0,
  total_debt numeric(14,2) not null default 0,
  monthly_income numeric(14,2) not null default 0,
  monthly_expense numeric(14,2) not null default 0,
  confidence integer not null default 60,
  created_at timestamptz not null default now()
);

create index if not exists idx_profile_user on wealth_profile(user_id);
create index if not exists idx_money_item_user_profile on money_item(user_id, profile_id);
create index if not exists idx_clue_user_profile on clue(user_id, profile_id);
create index if not exists idx_snapshot_user_profile on wealth_snapshot(user_id, profile_id);
