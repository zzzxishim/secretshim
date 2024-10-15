const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith(' Magickey ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
      
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; 
        console.log(`User authenticated: ${verified.username}`); 
        next(); 
    } catch (err) {
        console.error('Token verification failed:', err.message); 
        res.status(403).json({ error: 'Invalid token. Access forbidden.' }); 
    }
};

module.exports = authenticateToken;
