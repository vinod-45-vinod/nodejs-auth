const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// register contoller endpoint
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return  res.status(400).json({ message: 'Username or Email already exists' });
        }   

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // save the user to the database
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Some error occurred! Please try again' });
    }
}      

// login controller endpoint
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // find the user by username
        const user = await User.findOne({ username });
        if(!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // create and sign a JWT token
        const token = jwt.sign({ 
                userId: user._id, 
                username: user.username, 
                role: user.role 
            }, process.env.JWT_SECRET, { 
                expiresIn: '1h' 
            }
        );

        res.status(200).json({ 
            message: 'Login successful and token generated',
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Some error occurred! Please try again' });
    }
}  

const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId; // user is from the middleware      
        const { oldPassword, newPassword } = req.body;
        // find the user by id
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check the old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Some error occurred! Please try again' });
    }
}

module.exports = { registerUser, loginUser, changePassword };