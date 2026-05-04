const { pool } = require('../db');

async function getListings(req, res) {
  const {
    page = 1,
    limit = 12,
    min_price,
    max_price,
    min_beds,
    min_baths,
    property_type,
    city,
    lat,
    lng,
    radius_km = 10,
    sort = 'created_at_desc',
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  const conditions = ['l.status = $1'];
  const values = ['active'];
  let idx = 2;

  if (min_price) { conditions.push(`l.price >= $${idx++}`); values.push(Number(min_price)); }
  if (max_price) { conditions.push(`l.price <= $${idx++}`); values.push(Number(max_price)); }
  if (min_beds)  { conditions.push(`l.bedrooms >= $${idx++}`); values.push(Number(min_beds)); }
  if (min_baths) { conditions.push(`l.bathrooms >= $${idx++}`); values.push(Number(min_baths)); }
  if (property_type) { conditions.push(`l.property_type = $${idx++}`); values.push(property_type); }
  if (city)      { conditions.push(`LOWER(l.city) LIKE LOWER($${idx++})`); values.push(`%${city}%`); }

  // Geo search using PostGIS ST_DWithin (degrees ~ km/111)
  if (lat && lng) {
    conditions.push(
      `ST_DWithin(l.location::geography, ST_MakePoint($${idx++}, $${idx++})::geography, $${idx++})`
    );
    values.push(Number(lng), Number(lat), Number(radius_km) * 1000);
  }

  const where = conditions.join(' AND ');
  const orderMap = {
    created_at_desc: 'l.created_at DESC',
    price_asc: 'l.price ASC',
    price_desc: 'l.price DESC',
    beds_desc: 'l.bedrooms DESC',
  };
  const order = orderMap[sort] || 'l.created_at DESC';

  try {
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM listings l WHERE ${where}`,
      values
    );
    const total = parseInt(countRes.rows[0].count, 10);

    const { rows } = await pool.query(
      `SELECT l.*, u.name AS agent_name, u.email AS agent_email,
              ST_Y(l.location::geometry) AS lat, ST_X(l.location::geometry) AS lng
       FROM listings l
       LEFT JOIN users u ON l.agent_id = u.id
       WHERE ${where}
       ORDER BY ${order}
       LIMIT $${idx++} OFFSET $${idx++}`,
      [...values, Number(limit), offset]
    );

    res.json({ data: rows, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
}

async function getListingById(req, res) {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT l.*, u.name AS agent_name, u.email AS agent_email, u.avatar_url AS agent_avatar,
              ST_Y(l.location::geometry) AS lat, ST_X(l.location::geometry) AS lng
       FROM listings l
       LEFT JOIN users u ON l.agent_id = u.id
       WHERE l.id = $1`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Listing not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
}

async function createListing(req, res) {
  const {
    title, description, price, address, city, state, zip_code, country = 'US',
    bedrooms, bathrooms, area_sqft, property_type, lat, lng, images = [],
  } = req.body;

  if (!title || !price || !address || !lat || !lng) {
    return res.status(400).json({ error: 'title, price, address, lat, lng are required' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO listings
         (title, description, price, address, city, state, zip_code, country,
          bedrooms, bathrooms, area_sqft, property_type, location, images, agent_id, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,ST_MakePoint($13,$14),$15,$16,'active')
       RETURNING *`,
      [title, description, price, address, city, state, zip_code, country,
       bedrooms, bathrooms, area_sqft, property_type, Number(lng), Number(lat),
       JSON.stringify(images), req.user.id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create listing' });
  }
}

async function updateListing(req, res) {
  const { id } = req.params;
  const fields = req.body;

  try {
    const existing = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
    if (!existing.rows.length) return res.status(404).json({ error: 'Listing not found' });
    if (existing.rows[0].agent_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const allowed = ['title','description','price','address','city','state','zip_code',
                     'bedrooms','bathrooms','area_sqft','property_type','images','status'];
    const sets = [];
    const values = [];
    let idx = 1;
    for (const key of allowed) {
      if (fields[key] !== undefined) {
        sets.push(`${key} = $${idx++}`);
        values.push(key === 'images' ? JSON.stringify(fields[key]) : fields[key]);
      }
    }
    if (fields.lat && fields.lng) {
      sets.push(`location = ST_MakePoint($${idx++}, $${idx++})`);
      values.push(Number(fields.lng), Number(fields.lat));
    }
    if (!sets.length) return res.status(400).json({ error: 'No fields to update' });

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE listings SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`,
      values
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update listing' });
  }
}

async function deleteListing(req, res) {
  const { id } = req.params;
  try {
    const existing = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
    if (!existing.rows.length) return res.status(404).json({ error: 'Listing not found' });
    if (existing.rows[0].agent_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await pool.query('DELETE FROM listings WHERE id = $1', [id]);
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
}

async function saveListing(req, res) {
  const { id } = req.params;
  try {
    await pool.query(
      'INSERT INTO saved_listings (user_id, listing_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, id]
    );
    res.json({ message: 'Listing saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save listing' });
  }
}

async function unsaveListing(req, res) {
  const { id } = req.params;
  try {
    await pool.query(
      'DELETE FROM saved_listings WHERE user_id = $1 AND listing_id = $2',
      [req.user.id, id]
    );
    res.json({ message: 'Listing removed from saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove saved listing' });
  }
}

async function getSavedListings(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT l.*, ST_Y(l.location::geometry) AS lat, ST_X(l.location::geometry) AS lng
       FROM saved_listings sl
       JOIN listings l ON sl.listing_id = l.id
       WHERE sl.user_id = $1
       ORDER BY sl.saved_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch saved listings' });
  }
}

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  saveListing,
  unsaveListing,
  getSavedListings,
};
