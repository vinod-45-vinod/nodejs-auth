
const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        next(); // user is admin, proceed to the next middleware/route handler
    } else {
        return res.status(403).json({ message: 'Access Denied: Admins Only' });
    }   
}

module.exports = isAdmin;