const express = require('express')
const User = require('../models/User')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.get('/', auth('admin'), async (req, res) => {
  try{
    const users = await User.find().select('-password')
    res.json(users)
  }catch(err){ res.status(500).json({ message: 'Server error' }) }
})

router.post('/:id/role', auth('admin'), async (req, res) => {
  try{
    const { role } = req.body
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role' })
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'Not found' })
    user.role = role
    await user.save()
    res.json({ ok: true })
  }catch(err){ res.status(500).json({ message: 'Server error' }) }
})

module.exports = router
