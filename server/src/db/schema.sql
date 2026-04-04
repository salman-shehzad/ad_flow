CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  duration_days INT NOT NULL,
  weight INT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  is_featured BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS ads (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id INT REFERENCES categories(id),
  city_id INT REFERENCES cities(id),
  status TEXT NOT NULL,
  publish_at TIMESTAMP,
  expire_at TIMESTAMP,
  package_id INT REFERENCES packages(id),
  admin_boost INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  ad_id INT REFERENCES ads(id),
  amount NUMERIC(10,2) NOT NULL,
  transaction_ref TEXT NOT NULL,
  screenshot_url TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ad_media (
  id SERIAL PRIMARY KEY,
  ad_id INT REFERENCES ads(id),
  source_type TEXT NOT NULL,
  original_url TEXT NOT NULL,
  thumbnail_url TEXT,
  validation_status TEXT NOT NULL DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  actor_user_id INT REFERENCES users(id),
  entity_type TEXT NOT NULL,
  entity_id INT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ad_status_history (
  id SERIAL PRIMARY KEY,
  ad_id INT REFERENCES ads(id),
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by INT REFERENCES users(id),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
