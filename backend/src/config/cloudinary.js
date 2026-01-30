import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';

// Load environment variables directly in this file
dotenv.config();

// Configure Cloudinary with explicit values
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Debug log
console.log('🔧 Cloudinary Configuration Check:');
console.log('   Cloud Name:', cloudinaryConfig.cloud_name || '❌ MISSING');
console.log('   API Key:', cloudinaryConfig.api_key || '❌ MISSING');
console.log('   API Secret:', cloudinaryConfig.api_secret ? '✅ Present' : '❌ MISSING');

// Verify all credentials are present
if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
  console.error('❌ ERROR: Missing Cloudinary credentials!');
  console.error('Please check your .env file has:');
  console.error('  CLOUDINARY_CLOUD_NAME');
  console.error('  CLOUDINARY_API_KEY');
  console.error('  CLOUDINARY_API_SECRET');
}

// Configure cloudinary
cloudinary.config(cloudinaryConfig);

// Helper function to upload buffer to Cloudinary
export const uploadToCloudinary = (buffer, folder = 'ciliade-products') => {
  return new Promise((resolve, reject) => {
    // Pass config explicitly in the upload
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        cloud_name: cloudinaryConfig.cloud_name,
        api_key: cloudinaryConfig.api_key,
        api_secret: cloudinaryConfig.api_secret,
      },
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary upload error:', error);
          reject(error);
        } else {
          console.log('✅ Image uploaded to Cloudinary:', result.public_id);
          resolve(result);
        }
      }
    );

    const readableStream = Readable.from(buffer);
    readableStream.pipe(uploadStream);
  });
};

export default cloudinary;