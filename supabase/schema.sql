CREATE TABLE scenarios (
  id TEXT PRIMARY KEY,
  module TEXT,
  city_model TEXT,
  assumptions JSONB,
  data JSONB,
  ai_generated BOOLEAN,
  created_at TIMESTAMP,
  expire_at TIMESTAMP
);
