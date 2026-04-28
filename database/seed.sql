-- ============================================================
--  EasyHomeSearch – demo seed data
--  Run AFTER schema.sql
-- ============================================================

-- Demo agent users (passwords are all "password123")
INSERT INTO users (id, name, email, password_hash, role, phone, bio)
VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001',
   'Alice Agent',
   'alice@demo.com',
   '$2a$12$K8h5C1wjJLg0KzXqLg7jf.MV5jXsmIMf0uKxULhFxFE9fkB3s2WXW',
   'agent', '+1-415-555-0101',
   'Top-rated agent in San Francisco with 10+ years experience.'),
  ('aaaaaaaa-0000-0000-0000-000000000002',
   'Bob Broker',
   'bob@demo.com',
   '$2a$12$K8h5C1wjJLg0KzXqLg7jf.MV5jXsmIMf0uKxULhFxFE9fkB3s2WXW',
   'agent', '+1-310-555-0202',
   'LA specialist – luxury condos & beach properties.'),
  ('aaaaaaaa-0000-0000-0000-000000000003',
   'Demo Buyer',
   'buyer@demo.com',
   '$2a$12$K8h5C1wjJLg0KzXqLg7jf.MV5jXsmIMf0uKxULhFxFE9fkB3s2WXW',
   'buyer', NULL, NULL)
ON CONFLICT DO NOTHING;

-- Demo listings
INSERT INTO listings
  (id, title, description, price, address, city, state, zip_code,
   bedrooms, bathrooms, area_sqft, property_type, location, images, agent_id)
VALUES
  ('bbbbbbbb-0000-0000-0000-000000000001',
   'Sunny 3-Bed Home in Mission District',
   'Beautiful Victorian-style home with updated kitchen and hardwood floors throughout.',
   1250000, '123 Valencia St', 'San Francisco', 'CA', '94103',
   3, 2.0, 1800,  'house',
   ST_MakePoint(-122.4194, 37.7749),
   '[{"url":"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800","alt":"Front"}]',
   'aaaaaaaa-0000-0000-0000-000000000001'),

  ('bbbbbbbb-0000-0000-0000-000000000002',
   'Modern 2-Bed Condo with City Views',
   'Luxury condo on the 18th floor with panoramic Bay views, concierge, and gym.',
   875000, '555 Market St #1800', 'San Francisco', 'CA', '94105',
   2, 2.0, 1100, 'condo',
   ST_MakePoint(-122.3968, 37.7907),
   '[{"url":"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800","alt":"Living room"}]',
   'aaaaaaaa-0000-0000-0000-000000000001'),

  ('bbbbbbbb-0000-0000-0000-000000000003',
   'Spacious 4-Bed Family Home – Palo Alto',
   'Quiet cul-de-sac, large backyard, walking distance to top-rated schools.',
   2100000, '88 Elm Court', 'Palo Alto', 'CA', '94301',
   4, 3.0, 2600, 'house',
   ST_MakePoint(-122.1430, 37.4419),
   '[{"url":"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","alt":"Exterior"}]',
   'aaaaaaaa-0000-0000-0000-000000000002'),

  ('bbbbbbbb-0000-0000-0000-000000000004',
   'Cozy 1-Bed Apartment in Silver Lake',
   'Bright open plan, rooftop deck, steps from top restaurants and art galleries.',
   545000, '900 Sunset Blvd #4B', 'Los Angeles', 'CA', '90026',
   1, 1.0, 750,  'apartment',
   ST_MakePoint(-118.2726, 34.0857),
   '[{"url":"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800","alt":"Living area"}]',
   'aaaaaaaa-0000-0000-0000-000000000002'),

  ('bbbbbbbb-0000-0000-0000-000000000005',
   'Oceanfront Townhouse – Santa Monica',
   '3-level townhouse with private patio, garage, and direct beach access.',
   3200000, '1 Ocean Ave #10', 'Santa Monica', 'CA', '90401',
   3, 3.5, 2200, 'townhouse',
   ST_MakePoint(-118.4912, 34.0195),
   '[{"url":"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800","alt":"Exterior"}]',
   'aaaaaaaa-0000-0000-0000-000000000002'),

  ('bbbbbbbb-0000-0000-0000-000000000006',
   'Vacant Land – Build Your Dream Home',
   '0.5 acre flat lot in an established neighbourhood, utilities at street.',
   320000, '200 Oak Lane', 'San Jose', 'CA', '95101',
   NULL, NULL, 21780, 'land',
   ST_MakePoint(-121.8863, 37.3382),
   '[{"url":"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800","alt":"Lot"}]',
   'aaaaaaaa-0000-0000-0000-000000000001')

ON CONFLICT DO NOTHING;
