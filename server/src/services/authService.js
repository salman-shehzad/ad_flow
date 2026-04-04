const bcrypt = require('bcryptjs');
const db = require('../db');
const { signToken } = require('../utils/jwt');

async function register(data) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  const result = await db.query(
    'INSERT INTO users(name,email,password_hash,role) VALUES ($1,$2,$3,$4) RETURNING id,name,email,role',
    [data.name, data.email, passwordHash, 'client'],
  );
  const user = result.rows[0];
  return { user, token: signToken(user) };
}

async function login(data) {
  const result = await db.query('SELECT * FROM users WHERE email=$1', [data.email]);
  const user = result.rows[0];
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const ok = await bcrypt.compare(data.password, user.password_hash);
  if (!ok) throw { status: 401, message: 'Invalid credentials' };
  const safe = { id: user.id, name: user.name, email: user.email, role: user.role };
  return { user: safe, token: signToken(safe) };
}

module.exports = { register, login };
