// const admin = require('./firebaseConfig')
// const { v4: uuidv4 } = require('uuid')

// const uploadImagesToFirebase = async (files, userId) => {
//     const bucket = admin.storage().bucket();
//     const imageUrls = [];

//     for (const file of files) {
//         const fileName = `properties/${userId}/${uuidv4()}-${file.originalname}`
//         const fileUpload = bucket.file(fileName);

//         await fileUpload.save(file.buffer, {
//             metadata: { contentType: file.mimetype },
//         } );

//         const [url] = await fileUpload.getSignedUrl({
//             action: 'read',
//             expires: '01-12-2030'  // set a long expiration for public access
//         });

//         imageUrls.push(url);
//     }
//     return imageUrls;
// }

// module.exports = { uploadImagesToFirebase }

// Import Firebase admin and UUID for unique file names
const admin = require('./firebaseConfig');
const { v4: uuidv4 } = require('uuid');

// Function to upload images to Firebase Storage and return their URLs
const uploadImagesToFirebase = async (files, userId) => {
  const bucket = admin.storage().bucket(); // Get the Firebase storage bucket
  const imageUrls = [];

  // Loop through each file to upload
  for (const file of files) {
    // Validate file properties
    if (!file.buffer || !file.mimetype || !file.originalname) {
      throw new Error('Invalid file: missing buffer, mimetype, or originalname');
    }

    // Create a unique file name using userId and a UUID
    const fileName = `properties/${userId}/${uuidv4()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    // Upload the file to Firebase Storage
    try {
      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
      });
    } catch (err) {
      console.error('File upload error:', err.message);
      throw new Error(`Failed to upload file ${file.originalname}: ${err.message}`);
    }

    // Generate a signed URL for the uploaded file
    try {
      const [url] = await fileUpload.getSignedUrl({
        action: 'read',
        expires: '01-12-2030', // Set a long expiration for public access
      });
      imageUrls.push(url);
    } catch (err) {
      console.error('Signed URL generation error:', err.message);
      throw new Error(`Failed to generate signed URL for ${file.originalname}: ${err.message}`);
    }
  }

  return imageUrls;
};

// Export the upload function
module.exports = { uploadImagesToFirebase };