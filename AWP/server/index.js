const express = require('express')
const cors = require('cors')
const path = require('path')
const { init } = require('./db')

const authRoutes = require('./routes/auth')
const docRoutes = require('./routes/documents')
const userRoutes = require('./routes/users')
const reportsRoutes = require('./routes/reports')
const Document = require('./models/Document')
const User = require('./models/User')
const { auth } = require('./middleware/auth')

async function main(){
  await init()
  const app = express()
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN || '*',
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
  app.use(express.json())
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

  app.use('/api/auth', authRoutes)
  app.use('/api/documents', docRoutes)
  app.use('/api/users', userRoutes)
  app.use('/api/reports', reportsRoutes)

  app.get('/api/stats', auth(), async (req, res) => {
    try{
      const [total, users] = await Promise.all([
        Document.countDocuments(),
        User.countDocuments()
      ])
      const recent = await Document.find().sort({ createdAt: -1 }).limit(10).populate('uploadedBy', 'name')
      res.json({ total, users, recent })
    }catch(err){ res.status(500).json({ message: 'Server error' }) }
  })

  const port = process.env.PORT || 4000
  app.listen(port, () => console.log(`DMS server running on ${port}`))
}

main()
