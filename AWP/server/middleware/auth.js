const jwt = require('jsonwebtoken')
const User = require('../models/User')

const secret = process.env.JWT_SECRET || 'dev-secret'

function auth(requiredRole){
  return async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
    const token = authHeader.split(' ')[1]
    try{
      const payload = jwt.verify(token, secret)
      const user = await User.findById(payload.id).select('-password')
      if (!user) return res.status(401).json({ message: 'Unauthorized' })
      if (requiredRole && user.role !== requiredRole) return res.status(403).json({ message: 'Forbidden' })
      req.user = user
      next()
    }catch(err){
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}

module.exports = { auth, secret }
