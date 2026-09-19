-- Testdaten für die lokale Entwicklung.
-- Einspielen mit:
--   npx wrangler d1 execute kochrezepte_achdb --local --file=./migrations/seed.sql

INSERT INTO source_types (source_type) VALUES
  ('Kochbuch'),
  ('Website');

INSERT INTO recipes (title, description, servings, prep_time, cook_time) VALUES
  ('Spaghetti Bolognese', 'Klassische italienische Pasta mit Hackfleischsauce.', 4, 15, 45),
  ('Gemüsecurry', 'Würziges Curry mit Kokosmilch und Saisongemüse.', 2, 20, 30);

INSERT INTO sources (recipe_id, source, source_detail, note, source_type_id) VALUES
  (1, 'Oma''s Kochbuch', 'Seite 42', 'Immer mit extra Parmesan', 1),
  (2, 'kochrezepte.de', 'https://www.kochrezepte.de/gemuesecurry', 'Etwas schärfer als im Original', 2);

INSERT INTO ingredients (name, type) VALUES
  ('Spaghetti', 'Nudeln'),
  ('Hackfleisch', 'Fleisch'),
  ('Kokosmilch', 'Milchprodukt'),
  ('Gemüse', 'Gemüse');

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount, unit) VALUES
  (1, 1, '400', 'g'),
  (1, 2, '300', 'g'),
  (2, 3, '400', 'ml'),
  (2, 4, '500', 'g');
