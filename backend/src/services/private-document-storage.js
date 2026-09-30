const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const { createReadStream } = require('fs');

const directory = path.resolve(
    __dirname,
    '../../private-uploads'
);

const extensions = {
    'application/pdf': '.pdf',
    'image/jpeg': '.jpg',
    'image/png': '.png',
};

const save = async (file) => {
    const key = `${crypto.randomUUID()}${extensions[file.mimetype]}`;

    await fs.mkdir(directory, {
        recursive: true,
    });

    await fs.writeFile(
        path.join(directory, key),
        file.buffer,
        {
            flag: 'wx',
        }
    );

    return key;
};

const read = async (key) => {
    if (!/^[0-9a-f-]{36}\.(pdf|jpg|png)$/i.test(key)) {
        return null;
    }

    try {
        await fs.access(
            path.join(directory, key)
        );

        return createReadStream(
            path.join(directory, key)
        );
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }

        throw error;
    }
};

const remove = async (key) => {
    return fs
        .unlink(path.join(directory, key))
        .catch((error) => {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        });
};

module.exports = {
    save,
    read,
    remove,
};