const mongoose = require('mongoose');
const Campaign = require('../models/campaign.model');
const { CAMPAIGN_STATUSES } = Campaign;
const CampaignParticipation = require('../models/campaign-participation.model');
const { PARTICIPATION_STATUSES } = CampaignParticipation;
const AdvertiserProfile = require('../models/advertiser-profile.model');
const AutoOwnerProfile = require('../models/auto-owner-profile.model');
const Vehicle = require('../models/vehicle.model');

const campaignFields = ['title', 'description', 'objectives', 'city', 'locality', 'startDate', 'endDate', 'requestedAutoCount'];
const bad = (res, message) => res.status(400).json({ success: false, error: { message } });
const idValid = (id) => mongoose.isObjectIdOrHexString(id);

const campaignPayload = (body, all) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Request body must be an object.' };
  const keys = Object.keys(body);
  const invalid = keys.find((key) => !campaignFields.includes(key));
  if (invalid) return { error: `Field is not allowed: ${invalid}.` };
  if (all) { const missing = campaignFields.find((key) => body[key] === undefined); if (missing) return { error: `Missing required field: ${missing}.` }; }
  const values = {};
  for (const key of campaignFields) if (body[key] !== undefined) values[key] = body[key];
  for (const key of ['title', 'description', 'objectives', 'city', 'locality']) if (values[key] !== undefined && typeof values[key] !== 'string') return { error: `Field must be a string: ${key}.` };
  if (values.requestedAutoCount !== undefined && (!Number.isInteger(values.requestedAutoCount) || values.requestedAutoCount < 1 || values.requestedAutoCount > 1000)) return { error: 'requestedAutoCount must be an integer from 1 to 1000.' };
  for (const key of ['startDate', 'endDate']) if (values[key] !== undefined) { const date = new Date(values[key]); if (Number.isNaN(date.getTime())) return { error: `Invalid ${key}.` }; values[key] = date; }
  if (values.startDate && values.endDate && values.endDate <= values.startDate) return { error: 'End date must be after the start date.' };
  return { values };
};

const createCampaign = async (req, res, next) => {
  const parsed = campaignPayload(req.body, true); if (parsed.error) return bad(res, parsed.error);
  try {
    if (!await AdvertiserProfile.exists({ user: req.auth.userId })) return res.status(403).json({ success: false, error: { message: 'Complete your advertiser profile before creating a campaign.' } });
    const campaign = await Campaign.create({ advertiser: req.auth.userId, ...parsed.values });
    return res.status(201).json({ success: true, data: { campaign } });
  } catch (error) { if (error.name === 'ValidationError') return bad(res, 'Invalid campaign data.'); return next(error); }
};

const addParticipants = async (campaigns) => {
  const ids = campaigns.map((campaign) => campaign._id);
  const participations = await CampaignParticipation.find({ campaign: { $in: ids } })
    .populate({ path: 'autoOwner', select: 'user city locality', populate: { path: 'user', select: 'name email mobileNumber' } })
    .populate('vehicle', 'registrationNumber vehicleType')
    .sort({ createdAt: -1 });
  const grouped = new Map();
  participations.forEach((participation) => {
    const key = participation.campaign.toString();
    grouped.set(key, [...(grouped.get(key) || []), participation]);
  });
  return campaigns.map((campaign) => ({ ...campaign.toObject(), participants: grouped.get(campaign._id.toString()) || [] }));
};
const getMyCampaigns = async (req, res, next) => { try { const campaigns = await Campaign.find({ advertiser: req.auth.userId }).sort({ createdAt: -1 }); return res.json({ success: true, data: { campaigns: await addParticipants(campaigns) } }); } catch (error) { return next(error); } };
const getMyCampaign = async (req, res, next) => { if (!idValid(req.params.campaignId)) return bad(res, 'Invalid campaign ID.'); try { const campaign = await Campaign.findOne({ _id: req.params.campaignId, advertiser: req.auth.userId }); if (!campaign) return res.status(404).json({ success: false, error: { message: 'Campaign not found.' } }); const [withParticipants] = await addParticipants([campaign]); return res.json({ success: true, data: { campaign: withParticipants } }); } catch (error) { return next(error); } };
const updateCampaign = async (req, res, next) => { if (!idValid(req.params.campaignId)) return bad(res, 'Invalid campaign ID.'); const parsed = campaignPayload(req.body, false); if (parsed.error) return bad(res, parsed.error); if (!Object.keys(parsed.values).length) return bad(res, 'At least one campaign field is required.'); try { const campaign = await Campaign.findOne({ _id: req.params.campaignId, advertiser: req.auth.userId }); if (!campaign) return res.status(404).json({ success: false, error: { message: 'Campaign not found.' } }); if (campaign.status !== CAMPAIGN_STATUSES.PENDING) return bad(res, 'Only pending campaigns can be edited.'); Object.assign(campaign, parsed.values); await campaign.save(); return res.json({ success: true, data: { campaign } }); } catch (error) { if (error.name === 'ValidationError') return bad(res, 'Invalid campaign data.'); return next(error); } };

const getAdminCampaigns = async (req, res, next) => { const status = req.query.status; if (status && !Object.values(CAMPAIGN_STATUSES).includes(status)) return bad(res, 'Invalid campaign status filter.'); try { const campaigns = await Campaign.find(status ? { status } : {}).populate('advertiser', 'name email mobileNumber').sort({ createdAt: -1 }); return res.json({ success: true, data: { campaigns } }); } catch (error) { return next(error); } };
const getAdminCampaign = async (req, res, next) => { if (!idValid(req.params.campaignId)) return bad(res, 'Invalid campaign ID.'); try { const campaign = await Campaign.findById(req.params.campaignId).populate('advertiser', 'name email mobileNumber'); if (!campaign) return res.status(404).json({ success: false, error: { message: 'Campaign not found.' } }); return res.json({ success: true, data: { campaign } }); } catch (error) { return next(error); } };
const reviewCampaign = async (req, res, next) => { if (!idValid(req.params.campaignId)) return bad(res, 'Invalid campaign ID.'); const { status, rejectionReason } = req.body || {}; if (![CAMPAIGN_STATUSES.APPROVED, CAMPAIGN_STATUSES.REJECTED].includes(status)) return bad(res, 'Campaign status must be APPROVED or REJECTED.'); if (status === CAMPAIGN_STATUSES.REJECTED && (typeof rejectionReason !== 'string' || rejectionReason.trim().length < 3)) return bad(res, 'A rejection reason of at least 3 characters is required.'); try { const campaign = await Campaign.findOneAndUpdate({ _id: req.params.campaignId, status: CAMPAIGN_STATUSES.PENDING }, { status, reviewedBy: req.auth.userId, reviewedAt: new Date(), rejectionReason: status === CAMPAIGN_STATUSES.REJECTED ? rejectionReason.trim() : undefined }, { new: true, runValidators: true }); if (!campaign) return bad(res, 'Only pending campaigns can be reviewed.'); return res.json({ success: true, data: { campaign } }); } catch (error) { return next(error); } };

const availableCampaigns = async (req, res, next) => { try { const campaigns = await Campaign.find({ status: CAMPAIGN_STATUSES.APPROVED, endDate: { $gte: new Date() }, $expr: { $lt: ['$participantCount', '$requestedAutoCount'] } }).populate('advertiser', 'name email mobileNumber').sort({ startDate: 1 }); const profiles = await AdvertiserProfile.find({ user: { $in: campaigns.map((campaign) => campaign.advertiser?._id).filter(Boolean) } }).select('user businessName businessType businessAddress city locality pincode'); const profileByUser = new Map(profiles.map((profile) => [profile.user.toString(), profile])); const detailed = campaigns.map((campaign) => ({ ...campaign.toObject(), advertiserProfile: profileByUser.get(campaign.advertiser?._id?.toString()) || null })); return res.json({ success: true, data: { campaigns: detailed } }); } catch (error) { return next(error); } };
const ownerEligibility = async (userId, vehicleId) => { const profile = await AutoOwnerProfile.findOne({ user: userId, verificationStatus: 'APPROVED' }); if (!profile) return { error: 'An approved auto-owner profile is required to participate.' }; const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: profile._id, verificationStatus: 'APPROVED' }); if (!vehicle) return { error: 'Select one of your approved vehicles to participate.' }; return { profile, vehicle }; };
const joinCampaign = async (req, res, next) => { if (!idValid(req.params.campaignId) || !idValid(req.body?.vehicleId)) return bad(res, 'A valid campaign ID and vehicle ID are required.'); try { const eligibility = await ownerEligibility(req.auth.userId, req.body.vehicleId); if (eligibility.error) return res.status(403).json({ success: false, error: { message: eligibility.error } }); const { profile, vehicle } = eligibility; const existing = await CampaignParticipation.findOne({ autoOwner: profile._id, status: PARTICIPATION_STATUSES.ACTIVE }); if (existing) return res.status(409).json({ success: false, error: { message: 'You already have an active campaign participation.' } }); const campaign = await Campaign.findOneAndUpdate({ _id: req.params.campaignId, status: CAMPAIGN_STATUSES.APPROVED, endDate: { $gte: new Date() }, $expr: { $lt: ['$participantCount', '$requestedAutoCount'] } }, { $inc: { participantCount: 1 } }, { new: true }); if (!campaign) return res.status(409).json({ success: false, error: { message: 'Campaign is unavailable or full.' } }); try { const participation = await CampaignParticipation.create({ campaign: campaign._id, autoOwner: profile._id, vehicle: vehicle._id }); return res.status(201).json({ success: true, data: { participation, campaign } }); } catch (error) { await Campaign.updateOne({ _id: campaign._id, participantCount: { $gt: 0 } }, { $inc: { participantCount: -1 } }); if (error.code === 11000) return res.status(409).json({ success: false, error: { message: 'You already have an active campaign participation.' } }); throw error; } } catch (error) { return next(error); } };
const myParticipations = async (req, res, next) => { try { const profile = await AutoOwnerProfile.findOne({ user: req.auth.userId }); if (!profile) return res.json({ success: true, data: { participations: [] } }); const participations = await CampaignParticipation.find({ autoOwner: profile._id }).populate('campaign').populate('vehicle', 'registrationNumber vehicleType').sort({ createdAt: -1 }); return res.json({ success: true, data: { participations } }); } catch (error) { return next(error); } };
const endParticipation = async (req, res, next) => { if (!idValid(req.params.participationId)) return bad(res, 'Invalid participation ID.'); const status = req.body?.status; if (![PARTICIPATION_STATUSES.CANCELLED, PARTICIPATION_STATUSES.COMPLETED].includes(status)) return bad(res, 'Status must be CANCELLED or COMPLETED.'); try { const profile = await AutoOwnerProfile.findOne({ user: req.auth.userId }); if (!profile) return res.status(404).json({ success: false, error: { message: 'Auto owner profile not found.' } }); const participation = await CampaignParticipation.findOneAndUpdate({ _id: req.params.participationId, autoOwner: profile._id, status: PARTICIPATION_STATUSES.ACTIVE }, { status, endedAt: new Date() }, { new: true }); if (!participation) return bad(res, 'Active participation not found.'); await Campaign.updateOne({ _id: participation.campaign, participantCount: { $gt: 0 } }, { $inc: { participantCount: -1 } }); return res.json({ success: true, data: { participation } }); } catch (error) { return next(error); } };

module.exports = { createCampaign, getMyCampaigns, getMyCampaign, updateCampaign, getAdminCampaigns, getAdminCampaign, reviewCampaign, availableCampaigns, joinCampaign, myParticipations, endParticipation };
