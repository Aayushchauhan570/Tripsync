import jwt from "jsonwebtoken";
import User from "../models/users.js";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Check if authorization header exists and starts with 'Bearer'
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }

        // Extract token from header
        const token = authHeader.split(' ')[1];
        console.log(token);

        if (!token) {
            return res.status(401).json({ error: "Access denied. Invalid token format." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user (use 'id' not '_id' for JWT payload)
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ error: "Access denied. User not found." });
        }

        console.log("Authenticated user:", req.user.username);
        console.log("Authenticated user:", req.user);
        next();
        
    } catch (error) {
        console.error("Auth middleware error:", error.message);
        
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Access denied. Invalid token." });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Access denied. Token expired." });
        }
        
        res.status(401).json({ error: "Access denied. Token verification failed." });
    }
};

export default authMiddleware;

