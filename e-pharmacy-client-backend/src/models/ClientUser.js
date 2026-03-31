const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clientUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true, minlength: 6 },
}, { timestamps: true });

clientUserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

clientUserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('ClientUser', clientUserSchema);
