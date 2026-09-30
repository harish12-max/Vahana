const mongoose = require('mongoose');
const AutoOwnerProfile = require('../models/auto-owner-profile.model');
const Vehicle = require('../models/vehicle.model');
const Document = require('../models/document.model');
const storage = require('../services/private-document-storage');

const { DOCUMENT_TYPES, DOCUMENT_STATUSES } = Document;

const bad = (res, message) => {
    return res.status(400).json({
        success: false,
        error: {
            message,
        },
    });
};

const validId = (id) => {
    return mongoose.isObjectIdOrHexString(id);
};

const safeName = (name) => {
    return (
        typeof name === 'string' &&
        name.length <= 255 &&
        name.length &&
        !name.includes('..') &&
        !/[\\/]/.test(name) &&
        !name.startsWith('.')
    );
};

const ownerVehicle = async (user, id) => {
    const profile = await AutoOwnerProfile.findOne({
        user,
    });

    return (
        profile &&
        Vehicle.findOne({
            _id: id,
            owner: profile._id,
        })
    );
};

const fail = (error, res, next) => {
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            error: {
                message:
                    'An active document of this type already exists for this vehicle.',
            },
        });
    }

    if (
        error.name === 'ValidationError' ||
        error.name === 'CastError'
    ) {
        return bad(res, 'Invalid document data.');
    }

    return next(error);
};

const uploadDocument = async (req, res, next) => {
    if (!validId(req.params.vehicleId)) {
        return bad(res, 'Invalid vehicle ID.');
    }

    if (!DOCUMENT_TYPES.includes(req.body.documentType)) {
        return bad(res, 'Invalid document type.');
    }

    if (!req.file) {
        return bad(res, 'A document file is required.');
    }

    if (!safeName(req.file.originalname)) {
        return bad(res, 'Invalid document filename.');
    }

    let key;

    try {
        const vehicle = await ownerVehicle(
            req.auth.userId,
            req.params.vehicleId
        );

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Vehicle not found.',
                },
            });
        }

        const active = await Document.exists({
            vehicle: vehicle._id,
            documentType: req.body.documentType,
            verificationStatus: {
                $in: ['PENDING', 'APPROVED'],
            },
        });

        if (active) {
            return res.status(409).json({
                success: false,
                error: {
                    message:
                        'An active document of this type already exists for this vehicle.',
                },
            });
        }

        key = await storage.save(req.file);

        const document = await Document.create({
            vehicle: vehicle._id,
            documentType: req.body.documentType,
            storageKey: key,
            originalFilename: req.file.originalname,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
        });

        return res.status(201).json({
            success: true,
            data: {
                document,
            },
        });
    } catch (error) {
        if (key) {
            await storage.remove(key).catch(() => {});
        }

        return fail(error, res, next);
    }
};

const getVehicleDocuments = async (req, res, next) => {
    if (!validId(req.params.vehicleId)) {
        return bad(res, 'Invalid vehicle ID.');
    }

    try {
        const vehicle = await ownerVehicle(
            req.auth.userId,
            req.params.vehicleId
        );

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Vehicle not found.',
                },
            });
        }

        const documents = await Document.find({
            vehicle: vehicle._id,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            data: {
                documents,
            },
        });
    } catch (error) {
        return next(error);
    }
};

const stream = async (document, res, next) => {
    try {
        const file = await storage.read(document.storageKey);

        if (!file) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Document file not found.',
                },
            });
        }

        res.set({
            'Content-Type': document.mimeType,
            'Content-Disposition': `attachment; filename="${document.originalFilename}"`,
            'Content-Length': document.fileSize,
        });

        file.on('error', next);

        return file.pipe(res);
    } catch (error) {
        return next(error);
    }
};

const downloadOwnerDocument = async (req, res, next) => {
    if (
        !validId(req.params.vehicleId) ||
        !validId(req.params.documentId)
    ) {
        return bad(res, 'Invalid vehicle or document ID.');
    }

    try {
        const vehicle = await ownerVehicle(
            req.auth.userId,
            req.params.vehicleId
        );

        if (!vehicle) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Vehicle not found.',
                },
            });
        }

        const document = await Document.findOne({
            _id: req.params.documentId,
            vehicle: vehicle._id,
        }).select('+storageKey');

        if (!document) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Document not found.',
                },
            });
        }

        return stream(document, res, next);
    } catch (error) {
        return next(error);
    }
};

const getDocumentsForAdmin = async (req, res, next) => {
    try {
        const documents = await Document.find()
            .sort({
                createdAt: -1,
            })
            .populate(
                'vehicle',
                'owner registrationNumber vehicleType'
            )
            .populate('reviewer', 'name email');

        return res.status(200).json({
            success: true,
            data: {
                documents,
            },
        });
    } catch (error) {
        return next(error);
    }
};

const downloadAdminDocument = async (req, res, next) => {
    if (!validId(req.params.documentId)) {
        return bad(res, 'Invalid document ID.');
    }

    try {
        const document = await Document.findById(
            req.params.documentId
        ).select('+storageKey');

        if (!document) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Document not found.',
                },
            });
        }

        return stream(document, res, next);
    } catch (error) {
        return next(error);
    }
};

const updateDocumentVerification = async (req, res, next) => {
    if (!validId(req.params.documentId)) {
        return bad(res, 'Invalid document ID.');
    }

    const fields = Object.keys(req.body || {});

    if (
        fields.some(
            (field) =>
                !['verificationStatus', 'rejectionReason'].includes(field)
        ) ||
        !fields.includes('verificationStatus')
    ) {
        return bad(
            res,
            'Only verificationStatus and rejectionReason may be provided.'
        );
    }

    const { verificationStatus, rejectionReason } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(verificationStatus)) {
        return bad(res, 'Invalid verification status.');
    }

    if (
        verificationStatus === 'REJECTED' &&
        (typeof rejectionReason !== 'string' ||
            !rejectionReason.trim())
    ) {
        return bad(
            res,
            'A rejection reason is required when rejecting a document.'
        );
    }

    try {
        const document = await Document.findById(
            req.params.documentId
        );

        if (!document) {
            return res.status(404).json({
                success: false,
                error: {
                    message: 'Document not found.',
                },
            });
        }

        if (document.verificationStatus !== 'PENDING') {
            return bad(
                res,
                'Only pending documents can be reviewed.'
            );
        }

        document.verificationStatus = verificationStatus;
        document.reviewer = req.auth.userId;
        document.reviewedAt = new Date();

        document.rejectionReason =
            verificationStatus === 'REJECTED'
                ? rejectionReason.trim()
                : undefined;

        await document.save();

        return res.status(200).json({
            success: true,
            data: {
                document,
            },
        });
    } catch (error) {
        return fail(error, res, next);
    }
};

module.exports = {
    uploadDocument,
    getVehicleDocuments,
    downloadOwnerDocument,
    getDocumentsForAdmin,
    downloadAdminDocument,
    updateDocumentVerification,
};