const AdvertiserProfile = require('../models/advertiser-profile.model');
const AutoOwnerProfile = require('../models/auto-owner-profile.model');
const Vehicle = require('../models/vehicle.model');
const Document = require('../models/document.model');
const Campaign = require('../models/campaign.model');

// Administrative overview intentionally omits passwords, storage keys, and file paths.
const getUserOverview = async (req, res, next) => {
  try {
    const advertisers = await AdvertiserProfile.find().populate('user', 'name email mobileNumber accountStatus');
    const advertiserIds = advertisers.map((profile) => profile.user?._id).filter(Boolean);
    const campaigns = await Campaign.find({ advertiser: { $in: advertiserIds } }).select('advertiser title status city locality participantCount requestedAutoCount');
    const campaignsByAdvertiser = new Map();
    campaigns.forEach((campaign) => campaignsByAdvertiser.set(campaign.advertiser.toString(), [...(campaignsByAdvertiser.get(campaign.advertiser.toString()) || []), campaign]));
    const advertiserData = advertisers.map((profile) => ({ ...profile.toObject(), campaigns: campaignsByAdvertiser.get(profile.user?._id?.toString()) || [] }));

    const autoOwners = await AutoOwnerProfile.find().populate('user', 'name email mobileNumber accountStatus');
    const ownerIds = autoOwners.map((profile) => profile._id);
    const vehicles = await Vehicle.find({ owner: { $in: ownerIds } });
    const vehicleIds = vehicles.map((vehicle) => vehicle._id);
    const documents = await Document.find({ vehicle: { $in: vehicleIds } }).select('vehicle documentType verificationStatus originalFilename createdAt');
    const documentsByVehicle = new Map();
    documents.forEach((document) => documentsByVehicle.set(document.vehicle.toString(), [...(documentsByVehicle.get(document.vehicle.toString()) || []), document]));
    const vehiclesByOwner = new Map();
    vehicles.forEach((vehicle) => vehiclesByOwner.set(vehicle.owner.toString(), [...(vehiclesByOwner.get(vehicle.owner.toString()) || []), { ...vehicle.toObject(), documents: documentsByVehicle.get(vehicle._id.toString()) || [] }]));
    const ownerData = autoOwners.map((profile) => ({ ...profile.toObject(), vehicles: vehiclesByOwner.get(profile._id.toString()) || [] }));
    return res.json({ success: true, data: { advertisers: advertiserData, autoOwners: ownerData } });
  } catch (error) { return next(error); }
};

module.exports = { getUserOverview };
