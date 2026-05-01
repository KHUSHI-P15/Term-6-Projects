const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Document = require('../models/Document')
const { auth } = require('../middleware/auth')

const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Sanitize filename — strip spaces and special chars
    const ext = path.extname(file.originalname).toLowerCase()
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
    cb(null, `${Date.now()}-${base}${ext}`)
  }
})

const ALLOWED_TYPES = /pdf|docx?|xlsx?|pptx?|txt|png|jpe?g|gif|webp|zip|csv/i
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ALLOWED_TYPES.test(ext)) return cb(null, true)
    cb(new Error('File type not allowed'))
  }
})

const router = express.Router()

router.post('/upload', auth(), (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Upload error' })
    next()
  })
}, async (req, res) => {
  try{
    if (!req.file) return res.status(400).json({ message: 'No file provided' })
    const doc = await Document.create({
      title: req.body.title || req.file.originalname,
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      tags: (req.body.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      size: req.file.size,
      uploadedBy: req.user._id
    })
    res.json(doc)
  }catch(err){
    res.status(500).json({ message: 'Upload failed' })
  }
})

router.get('/', auth(), async (req, res) => {
  try{
    const q = req.query.q ? String(req.query.q).toLowerCase() : null
    let query = {}
    if (q) query = { $or: [ { title: { $regex: q, $options: 'i' } }, { tags: { $in: [ new RegExp(q, 'i') ] } } ] }
    const docs = await Document.find(query).sort({ createdAt: -1 }).populate('uploadedBy', 'name email')
    res.json(docs)
  }catch(err){ res.status(500).json({ message: 'Server error' }) }
})

router.get('/:id', auth(), async (req, res) => {
  try{
    const doc = await Document.findById(req.params.id).populate('uploadedBy', 'name email')
    if (!doc) return res.status(404).json({ message: 'Not found' })
    res.json(doc)
  }catch(err){ res.status(500).json({ message: 'Server error' }) }
})

router.put('/:id', auth(), async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    const isOwner = String(doc.uploadedBy) === String(req.user._id)
    const isAdmin = req.user.role === 'admin'
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' })

    const { title, tags } = req.body
    if (typeof title === 'string') doc.title = title
    if (Array.isArray(tags)) doc.tags = tags
    if (typeof tags === 'string') {
      doc.tags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    }

    await doc.save()
    res.json(doc)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', auth(), async (req, res) => {
  try{
    const doc = await Document.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Not found' })
    const isOwner = String(doc.uploadedBy) === String(req.user._id)
    const isAdmin = req.user.role === 'admin'
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Forbidden' })
    const filepath = path.join(uploadDir, doc.filename)
    await doc.deleteOne()
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
    res.json({ ok: true })
  }catch(err){ res.status(500).json({ message: 'Server error' }) }
})

module.exports = router
