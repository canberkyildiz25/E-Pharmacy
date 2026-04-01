require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./src/models/User')

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('MongoDB bağlandı')

  const existing = await User.findOne({ email: 'admin@epharmacy.com' })
  if (existing) {
    console.log('Admin zaten mevcut:', existing.email)
    process.exit(0)
  }

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@epharmacy.com',
    password: 'admin123',
    role: 'admin',
  })

  console.log('Admin oluşturuldu:', admin.email)
  process.exit(0)
}

seedAdmin().catch(err => { console.error(err); process.exit(1) })
