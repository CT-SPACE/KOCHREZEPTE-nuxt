CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  servings INTEGER,
  prep_time INTEGER,
  cook_time INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS source_types (
  stid INTEGER PRIMARY KEY AUTOINCREMENT,
  source_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id),
  source TEXT,
  source_detail TEXT,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  source_type_id INTEGER REFERENCES source_types(stid)
);

CREATE TABLE IF NOT EXISTS ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  type TEXT
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id),
  ingredient_id INTEGER NOT NULL REFERENCES ingredients(id),
  amount TEXT,
  unit TEXT
);