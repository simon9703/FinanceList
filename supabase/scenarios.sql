CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  module TEXT NOT NULL,
  city_model TEXT NOT NULL,
  hash TEXT,
  assumptions JSONB NOT NULL,
  data JSONB NOT NULL,
  ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL,
  expire_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS scenarios_module_expire_idx
ON scenarios (module, expire_at);

CREATE UNIQUE INDEX IF NOT EXISTS scenarios_module_hash_idx
ON scenarios (module, hash)
WHERE hash IS NOT NULL;
