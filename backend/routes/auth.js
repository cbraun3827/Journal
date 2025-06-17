const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password} = req.body;

    try {
        const existing = await User({ email });
        if( existing ) {
            return res.status(400).json({ message: "User already exists"});
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashed});
        await user.save();

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRETS, {expiresIn : '1h'});

        res.json( {token, user: {id: user._id, email: user.email }});
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
})