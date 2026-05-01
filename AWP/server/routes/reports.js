const express = require('express')
const { auth } = require('../middleware/auth')
const Document = require('../models/Document')
const User = require('../models/User')

const router = express.Router()

router.get('/overview', auth('admin'), async (req, res) => {
  try {
    const [totalDocuments, totalUsers] = await Promise.all([
      Document.countDocuments(),
      User.countDocuments()
    ])

    const docs = await Document.find({}, 'createdAt tags').sort({ createdAt: 1 })
    const uploadsByDay = {}
    const tagsBreakdown = {}

    docs.forEach((d) => {
      const day = new Date(d.createdAt).toISOString().slice(0, 10)
      uploadsByDay[day] = (uploadsByDay[day] || 0) + 1
      ;(d.tags || []).forEach((t) => {
        const key = String(t || '').trim()
        if (!key) return
        tagsBreakdown[key] = (tagsBreakdown[key] || 0) + 1
      })
    })

    res.json({
      totalDocuments,
      totalUsers,
      uploadsByDay,
      tagsBreakdown
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
