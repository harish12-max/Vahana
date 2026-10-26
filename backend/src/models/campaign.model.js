const mongoose = require('mongoose');

const CAMPAIGN_STATUSES = Object.freeze({
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
});

const campaignSchema = new mongoose.Schema(
    {
        advertiser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 150
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 2000
        },
        objectives: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 500
        },
        city: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        locality: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        requestedAutoCount: {
            type: Number,
            required: true,
            min: 1,
            max: 1000
        },
        participantCount: {
            type: Number,
            default: 0,
            min: 0
        },
        status: {
            type: String,
            enum: Object.values(CAMPAIGN_STATUSES),
            default: CAMPAIGN_STATUSES.PENDING,
            index: true
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewedAt: {
            type: Date
        },
        rejectionReason: {
            type: String,
            trim: true,
            maxlength: 500
        },
    },
    { timestamps: true },
);

campaignSchema.pre('validate', function validateDates(next) {
    if (
        this.startDate &&
        this.endDate &&
        this.endDate <= this.startDate
    ) {
        this.invalidate(
            'endDate',
            'End date must be after the start date.'
        );
    }

    next();
});

const Campaign =
    mongoose.models.Campaign ||
    mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;
module.exports.CAMPAIGN_STATUSES = CAMPAIGN_STATUSES;