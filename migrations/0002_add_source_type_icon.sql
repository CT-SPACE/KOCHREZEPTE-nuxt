ALTER TABLE source_types ADD COLUMN icon TEXT;
UPDATE source_types SET icon = 'mdi-bookshelf' WHERE source_type = 'Buch';
UPDATE source_types SET icon = 'mdi-web' WHERE source_type = 'Internet';
UPDATE source_types SET icon = 'mdi-book-open-page-variant' WHERE source_type = 'Magazin';
UPDATE source_types SET icon = 'mdi-acount-edit' WHERE source_type = 'Persönlich';
