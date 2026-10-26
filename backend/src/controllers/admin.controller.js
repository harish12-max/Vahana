
const AdvertiserProfile = require('../models/advertiser-profile.model');
const AutoOwnerProfile = require('../models/auto-owner-profile.model');
const Vehicle = require('../models/vehicle.model');
const Document = require('../models/document.model');
const Campaign = require('../models/campaign.model');

// Administrative overview intentionally omits passwords,
// storage keys, and file paths.
const getUserOverview = async (req, res, next) => {
    try {
        // Fetch advertiser profiles and their public user details.
        const advertisers = await AdvertiserProfile.find()
            .populate(
                'user',
                'name email mobileNumber accountStatus'
            );

        const advertiserIds = advertisers
            .map((profile) => profile.user?._id)
            .filter(Boolean);

        // Fetch campaigns belonging to these advertisers.
        const campaigns = await Campaign.find({
            advertiser: { $in: advertiserIds }
        }).select(
            'advertiser title status city locality participantCount requestedAutoCount'
        );

        // Group campaigns by advertiser ID.
        const campaignsByAdvertiser = new Map();

        campaigns.forEach((campaign) => {
            const advertiserId =
                campaign.advertiser.toString();

            const existingCampaigns =
                campaignsByAdvertiser.get(advertiserId) || [];

            campaignsByAdvertiser.set(
                advertiserId,
                [...existingCampaigns, campaign]
            );
        });

        // Attach campaigns to their respective advertisers.
        const advertiserData = advertisers.map((profile) => {
            const advertiserId =
                profile.user?._id?.toString();

            return {
                ...profile.toObject(),
                campaigns:
                    campaignsByAdvertiser.get(advertiserId) || []
            };
        });

        // Fetch auto-owner profiles and their public user details.
        const autoOwners = await AutoOwnerProfile.find()
            .populate(
                'user',
                'name email mobileNumber accountStatus'
            );

        const autoOwnerIds = autoOwners.map(
            (profile) => profile._id
        );

        // Fetch vehicles belonging to these auto-owner profiles.
        const vehicles = await Vehicle.find({
            owner: { $in: autoOwnerIds }
        });

        const vehicleIds = vehicles.map(
            (vehicle) => vehicle._id
        );

        // Fetch relevant document metadata only.
        const documents = await Document.find({
            vehicle: { $in: vehicleIds }
        }).select(
            'vehicle documentType verificationStatus originalFilename createdAt'
        );

        // Group documents by vehicle ID.
        const documentsByVehicle = new Map();

        documents.forEach((document) => {
            const vehicleId = document.vehicle.toString();

            const existingDocuments =
                documentsByVehicle.get(vehicleId) || [];

            documentsByVehicle.set(
                vehicleId,
                [...existingDocuments, document]
            );
        });

        // Group vehicles by auto-owner ID and attach documents.
        const vehiclesByOwner = new Map();

        vehicles.forEach((vehicle) => {
            const ownerId = vehicle.owner.toString();

            const vehicleData = {
                ...vehicle.toObject(),
                documents:
                    documentsByVehicle.get(
                        vehicle._id.toString()
                    ) || []
            };

            const existingVehicles =
                vehiclesByOwner.get(ownerId) || [];

            vehiclesByOwner.set(
                ownerId,
                [...existingVehicles, vehicleData]
            );
        });

        // Attach vehicles to their respective auto-owner profiles.
        const ownerData = autoOwners.map((profile) => {
            const ownerId = profile._id.toString();

            return {
                ...profile.toObject(),
                vehicles:
                    vehiclesByOwner.get(ownerId) || []
            };
        });

        return res.json({
            success: true,
            data: {
                advertisers: advertiserData,
                autoOwners: ownerData
            }
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    getUserOverview
};
