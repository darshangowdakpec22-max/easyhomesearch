const bcrypt = require('bcryptjs');
const { pool } = require('../db');

async function getProfile(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, avatar_url, phone, bio, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

async function updateProfile(req, res) {
  const { name, phone, bio, avatar_url } = req.body;
  const sets = [];
  const values = [];
  let idx = 1;

  if (name)       { sets.push(`name = $${idx++}`);       values.push(name); }
  if (phone)      { sets.push(`phone = $${idx++}`);      values.push(phone); }
  if (bio)        { sets.push(`bio = $${idx++}`);        values.push(bio); }
  if (avatar_url) { sets.push(`avatar_url = $${idx++}`); values.push(avatar_url); }

  if (!sets.length) return res.status(400).json({ error: 'No fields to update' });

  values.push(req.user.id);
  try {
    const { rows } = await pool.query(
      `UPDATE users SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING id, name, email, role, avatar_url, phone, bio`,
      values
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

async function changePassword(req, res) {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'current_password and new_password are required' });
  }
  if (new_password.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  try {
    const { rows } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    const valid = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    const hash = await bcrypt.hash(new_password, 12);
    await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, req.user.id]);
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to change password' });
  }
}

async function getMyListings(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT l.*, ST_Y(l.location::geometry) AS lat, ST_X(l.location::geometry) AS lng
       FROM listings l WHERE l.agent_id = $1 ORDER BY l.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your listings' });
  }
}

module.exports = { getProfile, updateProfile, changePassword, getMyListings };
