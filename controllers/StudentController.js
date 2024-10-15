const pool = require('../config/database');
const bcrypt = require('bcrypt');


const getAllStudents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT student_id, fullname, username, created_at, updated_at FROM students');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: `Failed to retrieve students: ${error.message}` });
  }
};


const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [row] = await pool.query('SELECT student_id, fullname, username, created_at, updated_at FROM students WHERE student_id = ?', [id]);
    if (row.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(row[0]);
  } catch (error) {
    res.status(500).json({ error: `Failed to retrieve student: ${error.message}` });
  }
};


const createStudent = async (req, res) => {
  const { fullname, username, password } = req.body;

  
  if (!fullname || !username || !password) {
    return res.status(400).json({ error: 'Fullname, username, and password are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query('INSERT INTO students (fullname, username, password) VALUES (?, ?, ?)', [fullname, username, hashedPassword]);
    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    res.status(500).json({ error: `Failed to create student: ${error.message}` });
  }
};


const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { fullname, username, password } = req.body;

  if (!fullname || !username || !password) {
    return res.status(400).json({ error: 'Fullname, username, and password are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const [result] = await pool.query('UPDATE student SET fullname = ?, username = ?, password = ? WHERE student_id = ?', [fullname, username, hashedPassword, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ error: `Failed to update student: ${error.message}` });
  }
};


const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM students WHERE student_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: ' Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: `Failed to delete Student: ${error.message}` });
  }
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };