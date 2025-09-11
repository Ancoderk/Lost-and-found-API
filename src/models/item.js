const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['lost','found'], required: true },
  category: { type: String, required: true, trim: true },
  location: { type: String, trim: true },
  date: { type: Date, required: true }, // date when item was lost/found
  contactInfo: { type: String, required: true, trim: true },
  imageURL: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);
