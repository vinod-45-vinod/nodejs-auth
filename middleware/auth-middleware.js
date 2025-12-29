const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log(authHeader);

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    // verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  
        console.log(decoded);
        req.user = decoded; // attach the decoded token payload to the request object (it is used in next middlewares)
        // Request → authMiddleware (adds req.user) → adminMiddleware (reads req.user) → Route Handler
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid Token' });
    }
}   

module.exports = authMiddleware;    