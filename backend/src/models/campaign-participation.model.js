const mongoose = require('mongoose');

const PARTICIPATION_STATUSES = Object.freeze({ ACTIVE: 'ACTIVE', CANCELLED: 'CANCELLED', COMPLETED: 'COMPLETED' });

const participationSchema = new mongoose.Schema(
  {
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
    autoOwner: { type: mongoose.Schema.Types.ObjectId, ref: 'AutoOwnerProfile', required: true, index: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    status: { type: String, enum: Object.values(PARTICIPATION_STATUSES), default: PARTICIPATION_STATUSES.ACTIVE },
    endedAt: { type: Date },
  },
  { timestamps: true },
);

// MongoDB enforces the one-active-campaign rule even when join requests race.
participationSchema.index({ autoOwner: 1 }, { unique: true, partialFilterExpression: { status: PARTICIPATION_STATUSES.ACTIVE } });
participationSchema.index({ campaign: 1, autoOwner: 1, status: 1 }, { unique: true, partialFilterExpression: { status: PARTICIPATION_STATUSES.ACTIVE } });

const CampaignParticipation = mongoose.models.CampaignParticipation || mongoose.model('CampaignParticipation', participationSchema);

module.exports = CampaignParticipation;
module.exports.PARTICIPATION_STATUSES = PARTICIPATION_STATUSES;
