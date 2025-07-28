import express from "express";
import cors from "cors";
import User from '../models/users.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';


// # Signup route
const signupRoute = async (req, res) => {  

    try {
        const {username, password} = req.body;
        const existing = await User.findOne({username})
        if (existing) {
            return res.status(400).json({error: 'User already exists'});
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword
        })

        await newUser.save();
        generateToken(newUser._id);

        res.status(201).json({message: 'User created successfully',
            _id : newUser._id,
            username : newUser.username,
            token: generateToken(newUser._id)

        }  
           
        );
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
}


export { signupRoute as default };