const pool = require('../config/database');
const bcrypt = require('bcrypt');
const { json } = require('express');
const salt = 15;
 
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, fullname, username, created_at, updated_at FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [row] = await pool.query('SELECT user_id, fullname, username, created_at, updated_at FROM users WHERE user_id = ?', [id]);
    if (row.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const { fullname, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    await pool.query('INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)', [fullname, username, hashedPassword]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullname, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, salt);
    const [result] = await pool.query('UPDATE users SET fullname = ?, username = ?, password = ? WHERE user_id = ?', [fullname, username, hashedPassword, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
