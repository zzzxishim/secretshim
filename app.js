const express = require('express');
const bodyParser = require ('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/deptRoutes');
const StudentRoutes = require('./routes/StudentRoutes');
const CourseRoutes = require('./routes/CourseRoutes');




const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send("Rene Richard Borela, MIT");
});

// Use the auth routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/Student', StudentRoutes);
app.use('/api/Course', CourseRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

