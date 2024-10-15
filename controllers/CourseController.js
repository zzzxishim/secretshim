const pool = require('../config/database');
const bcrypt = require('bcrypt');


const getAllCourses = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT department_id, fullname, username, created_at, updated_at FROM departments');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: `Failed to retrieve departments: ${error.message}` });
  }
};


const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const [row] = await pool.query('SELECT department_id, fullname, username, created_at, updated_at FROM departments WHERE user_id = ?', [id]);
    if (row.length === 0) {
      return res.status(404).json({ error: 'department not found' });
    }
    res.json(row[0]);
  } catch (error) {
    res.status(500).json({ error: `Failed to retrieve department: ${error.message}` });
  }
};


const createCourse = async (req, res) => {
  const { fullname, username, password } = req.body;

  
  if (!fullname || !username || !password) {
    return res.status(400).json({ error: 'Fullname, username, and password are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query('INSERT INTO departments (fullname, username, password) VALUES (?, ?, ?)', [fullname, username, hashedPassword]);
    res.status(201).json({ message: 'Department created successfully' });
  } catch (error) {
    res.status(500).json({ error: `Failed to create department: ${error.message}` });
  }
};


const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { fullname, username, password } = req.body;

  if (!fullname || !username || !password) {
    return res.status(400).json({ error: 'Fullname, username, and password are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const [result] = await pool.query('UPDATE courses SET fullname = ?, username = ?, password = ? WHERE course_id = ?', [fullname, username, hashedPassword, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ error: `Failed to update course: ${error.message}` });
  }
};


const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM courses WHERE course_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete Course: ${error.message}` });
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };