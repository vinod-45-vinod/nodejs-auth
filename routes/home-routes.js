const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');


router.get('/welcome', authMiddleware, (req, res) => {  // authMiddleware verifes the token for the protected route
    const userInfo = req.user; // access the user info from the request object
    res.json({ 
        message: 'Welcome to the Home Page',
        user: {
            userId: userInfo.userId,
            username: userInfo.username,
            role: userInfo.role
        }
    });
});

module.exports = router;