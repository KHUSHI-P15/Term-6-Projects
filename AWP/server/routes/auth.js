const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { secret } = require('../middleware/auth')

const router = express.Router()

router.post('/register', async (req, res) => {
  try{
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'User exists' })
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hash, role: 'user' })
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  }catch(err){
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try{
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  }catch(err){
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
