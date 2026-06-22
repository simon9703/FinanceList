create table if not exists scenarios (
  id text primary key,
  module text,
  city_model text,
  assumptions jsonb,
  data jsonb,
  ai_generated boolean,
  created_at timestamptz,
  expire_at timestamptz
);
