import User from '../models/users.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';


// # Signup route
const signupRoute = async (req, res) => {  
    try {
        const {username, password} = req.body;
        
        // Input validation
        if (!username || !password) {
            return res.status(400).json({error: 'Username and password are required'});
        }
        
        if (password.length < 6) {
            return res.status(400).json({error: 'Password must be at least 6 characters long'});
        }

        const existing = await User.findOne({username});
        if (existing) {
            return res.status(400).json({error: 'User already exists'});
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        const token = generateToken(newUser._id);

        res.status(201).json({
            message: 'User created successfully',
            _id: newUser._id,
            username: newUser.username,
            token
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

const loginRoute = async(req, res) => {
    try {
        const {username, password} = req.body;

        // Input validation
        if (!username || !password) {
            return res.status(400).json({error: 'Username and password are required'});
        }

        const userExist = await User.findOne({username});
        if (!userExist) {
            return res.status(400).json({error: 'Invalid credentials'});
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, userExist.password);
        if (!isPasswordValid) {
            return res.status(400).json({error: 'Invalid credentials'});
        }

        const token = generateToken(userExist._id);
        
        res.status(200).json({
            message: "Login successful", 
            _id: userExist._id,
            username: userExist.username,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const logoutRoute = async (req, res) => {
    try {
        // For JWT-based auth, logout is typically handled on the client side
        // by removing the token from storage. Server-side we can just confirm logout.
        // In more advanced implementations, you might want to blacklist the token.
        
        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({error: "Internal Server Error"});
    }
}


export { signupRoute, loginRoute, logoutRoute };