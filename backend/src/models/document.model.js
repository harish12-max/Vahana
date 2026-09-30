const mongoose = require('mongoose');

const DOCUMENT_TYPES = ['REGISTRATION_CERTIFICATE', 'INSURANCE_CERTIFICATE', 'VEHICLE_PERMIT', 'DRIVING_LICENSE'];
const DOCUMENT_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

const schema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },

  documentType: {
    type: String, required: true,
    enum: DOCUMENT_TYPES
  },

  storageKey: {
    type: String,
    required: true,
    unique: true,
    select: false
  },

  originalFilename: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },

  mimeType: {
    type: String,
    required: true,
    enum: ['application/pdf', 'image/jpeg', 'image/png']
  },

  fileSize: {
    type: Number,
    required: true,
    min: 1, max: 5 * 1024 * 1024
  },

  verificationStatus: {
    type: String,
    required: true,
    enum: DOCUMENT_STATUSES,
    default: 'PENDING'
  },

  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },


  reviewedAt: Date,

  rejectionReason: {
    type: String,
    trim: true,
    maxlength: 500
  },
}, { timestamps: true });

schema.index({ vehicle: 1, documentType: 1 },
  { unique: true, partialFilterExpression: { verificationStatus: { $in: ['PENDING', 'APPROVED'] } } }
);


const Document = mongoose.models.Document || mongoose.model('Document', schema);

module.exports = Document;
module.exports.DOCUMENT_TYPES = DOCUMENT_TYPES;
module.exports.DOCUMENT_STATUSES = DOCUMENT_STATUSES;
