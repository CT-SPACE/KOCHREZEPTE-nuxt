CREATE UNIQUE INDEX IF NOT EXISTS idx_ingredients_name_nocase
  ON ingredients(name COLLATE NOCASE);
