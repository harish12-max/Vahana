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
            !['image', 'raw'].includes(parsed.resourceType)
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
            }
        );

        Readable.from([buffer]).pipe(uploadStream);
    });

const save = async (file) => {
    const extension = extensions[file.mimetype];
    if (!extension) {
        throw new Error('Unsupported document file type.');
    }

    // Use Cloudinary's image resource type for image previews and raw for PDFs.
    const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
    const publicId = crypto.randomUUID();

    const result = await uploadBuffer(file.buffer, {
        folder: 'vahana/documents',
        public_id: publicId,
        resource_type: resourceType,
        ...(resourceType === 'raw' ? { use_filename: false, unique_filename: false } : {}),
        format: extension.slice(1),
        overwrite: false,
    });

    return JSON.stringify({
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format,
    });
};

const read = async (key) => {
    const asset = parseKey(key);

    // Read documents saved before Cloudinary was introduced.
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

    // Use a short-lived signed URL from the server SDK, then stream it through
    // the existing authenticated backend endpoint instead of exposing it in MongoDB.
    const signedUrl = cloudinary.url(asset.publicId, {
        resource_type: asset.resourceType,
        type: 'upload',
        secure: true,
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 60,
        ...(asset.format ? { format: asset.format } : {}),
    });

    return new Promise((resolve, reject) => {
        const request = https.get(signedUrl, (response) => {
            if (response.statusCode !== 200) {
                response.resume();
                if ([401, 403, 404].includes(response.statusCode)) {
                    return resolve(null);
                }
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
