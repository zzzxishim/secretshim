const express = require('express');
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/CourseController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();


router.get('/', authenticateToken, getAllCourses);
router.get('/:id', authenticateToken, getCourseById);
router.post('/', createCourse);
router.put('/:id', authenticateToken, updateCourse);
router.delete('/:id', authenticateToken, deleteCourse);

module.exports = router;
