const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
};



const jwt = require('jsonwebtoken');

function generateAccessToken(id, name, isPremiumUser) {
  return jwt.sign({ userId: id, name: name, isPremiumUser: isPremiumUser }, 'your_secret_key');
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      
      const token = generateAccessToken(user.id, user.name, user.isPremiumUser);
      return res.status(200).json({ message: 'User login successful', token, userId: user.id }); 
    } else {
      return res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
