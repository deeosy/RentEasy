const admin = require('./firebaseConfig')
const { v4: uuidv4 } = require('uuid')

const uploadImagesToFirebase = async (files, userId) => {
    const bucket = admin.storage().bucket();
    const imageUrls = [];

    for (const file of files) {
        const fileName = `properties/${userId}/${uuidv4()}-${file.originalname}`
        const fileUpload = bucket.file(fileName);

        await fileUpload.save(file.buffer, {
            metadata: { contentType: file.mimetype },
        } );

        const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '01-12-2030'  // set a long expiration for public access
        });

        imageUrls.push(url);
    }
    return imageUrls;
}

module.exports = { uploadImagesToFirebase }
