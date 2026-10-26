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
            typeof parsed.secureUrl !== 'string' ||
            !parsed.secureUrl.startsWith('https://res.cloudinary.com/')
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
        const stream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) return reject(error);
                if (!result) return reject(new Error('Cloudinary returned no upload result.'));
                return resolve(result);
            }
        );
        Readable.from([buffer]).pipe(stream);
    });

const save = async (file) => {
    const extension = extensions[file.mimetype];
    if (!extension) {
        throw new Error('Unsupported document file type.');
    }

    const result = await uploadBuffer(file.buffer, {
        folder: 'vahana/documents',
        public_id: crypto.randomUUID(),
        resource_type: 'image',
        format: extension.slice(1),
        overwrite: false,
    });

    return JSON.stringify({
        publicId: result.public_id,
        resourceType: 'image',
        secureUrl: result.secure_url,
    });
};

const read = async (key) => {
    const asset = parseKey(key);
    if (!asset) {
        if (!/^[0-9a-f-]{36}\\.(pdf|jpg|png)$/i.test(key)) return null;
        try {
            await fs.access(path.join(legacyDirectory, key));
            return createReadStream(path.join(legacyDirectory, key));
        } catch (error) {
            if (error.code === 'ENOENT') return null;
            throw error;
        }
    }

    return new Promise((resolve, reject) => {
        const request = https.get(asset.secureUrl, (response) => {
            if (response.statusCode !== 200) {
                response.resume();
                if (response.statusCode === 404) return resolve(null);
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
        if (/^[0-9a-f-]{36}\\.(pdf|jpg|png)$/i.test(key)) {
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
