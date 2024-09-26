const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'editor', 'viewer', 'data-entry'], default: 'viewer' }
  }],
  activities: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, enum: ['created', 'updated', 'deleted'], required: true },
    timestamp: { type: Date, default: Date.now },
    userRole: { type: String, enum: ['admin', 'editor', 'viewer', 'data-entry'], required: true }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);