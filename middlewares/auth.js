const jwt = require('jsonwebtoken');
const JWT_SECRET = "suvesh298";
const {userModel} = require('../models/model');

async function authenticate(req, res, next){
    const token = req.headers.token;
    if(!token){
        return res.status(401).json({
            message : "Access denied. No token provided."
        });
    }
    try{
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;

        const user = await userModel.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message : "User not found."
            });
        }
        req.user = user;
        next();
    }
    catch{
        res.status(400).json({message : "Invalid token."});
    }
}
// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, proceed
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
}

module.exports = { authenticate, isAdmin };