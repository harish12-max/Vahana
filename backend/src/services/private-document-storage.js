const crypto = require('crypto');
const https = require('https');
const fs = require('fs/promises');
const path = require('path');
const { createReadStream } = require('fs');
const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;

const legacyDirectory = path.resolve(__dirname, '../../private-uploads');

const extensions = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/png': '.png',
};

const parseKey = (key) => {
    try {
        const parsed = JSON.parse(key);
        if (
            !parsed ||
            typeof parsed.publicId !== 'string' ||
            !['image', 'raw'].includes(parsed.resourceType) ||
            (parsed.format && !['pdf', 'jpg', 'png'].includes(parsed.format))
        ) {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
};

const uploadBuffer = (buffer, options) =>
    new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) return reject(error);
                if (!result?.public_id || !result?.resource_type) {
                    return reject(new Error('Cloudinary returned an invalid upload result.'));
                }
                return resolve(result);
            },
        );

        uploadStream.on('error', reject);
        Readable.from([buffer]).pipe(uploadStream);
    });

const save = async (file) => {
    const extension = extensions[file.mimetype];
    if (!extension) {
        throw new Error('Unsupported document file type.');
    }

    const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
    const publicId = crypto.randomUUID();
    // Raw assets need their file extension in the public ID for reliable delivery.
    const uploadPublicId = resourceType === 'raw' ? `${publicId}${extension}` : publicId;

    const result = await uploadBuffer(file.buffer, {
        folder: 'vahana/documents',
        public_id: uploadPublicId,
        resource_type: resourceType,
        overwrite: false,
    });

    return JSON.stringify({
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format || extension.slice(1),
    });
};

const getSignedUrl = (asset) => {
    // Sign the server-generated URL instead of persisting a delivery URL in MongoDB.
    // Random IDs make asset URLs difficult to guess; the app still requires auth
    // for every download through the existing API route.
    return cloudinary.url(asset.publicId, {
        resource_type: asset.resourceType,
        type: 'upload',
        secure: true,
        sign_url: true,
        ...(asset.resourceType === 'raw' ? {} : { format: asset.format }),
    });
};

const read = async (key) => {
    const asset = parseKey(key);

    // Compatibility with documents uploaded before Cloudinary was configured.
    if (!asset) {
        if (typeof key !== 'string' || !/^[0-9a-f-]{36}\.(pdf|jpg|png)$/i.test(key)) {
            return null;
        }

        const localPath = path.join(legacyDirectory, key);
        try {
            await fs.access(localPath);
            return createReadStream(localPath);
        } catch (error) {
            if (error.code === 'ENOENT') return null;
            throw error;
        }
    }

    const signedUrl = getSignedUrl(asset);
    return new Promise((resolve, reject) => {
        const request = https.get(signedUrl, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                response.resume();
                https.get(response.headers.location, (redirectedResponse) => {
                    if (redirectedResponse.statusCode !== 200) {
                        redirectedResponse.resume();
                        if ([401, 403, 404].includes(redirectedResponse.statusCode)) return resolve(null);
                        return reject(new Error(`Cloudinary file request failed with status ${redirectedResponse.statusCode}.`));
                    }
                    return resolve(redirectedResponse);
                }).on('error', reject);
                return;
            }

            if (response.statusCode !== 200) {
                response.resume();
                if ([401, 403, 404].includes(response.statusCode)) return resolve(null);
                return reject(new Error(`Cloudinary file request failed with status ${response.statusCode}.`));
            }
            return resolve(response);
        });
        request.on('error', reject);
    });
};

const remove = async (key) => {
    const asset = parseKey(key);

    if (!asset) {
        if (typeof key === 'string' && /^[0-9a-f-]{36}\.(pdf|jpg|png)$/i.test(key)) {
            return fs.unlink(path.join(legacyDirectory, key)).catch((error) => {
                if (error.code !== 'ENOENT') throw error;
            });
        }
        return;
    }

    await cloudinary.uploader.destroy(asset.publicId, {
        resource_type: asset.resourceType,
        invalidate: true,
    });
};

module.exports = {
    save,
    read,
    remove,
};
