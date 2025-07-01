// middleware/uploadMiddleware.js
import multer from 'multer';
import { uploadToS3 } from '../services/Aws.service.js';

const storage = multer.memoryStorage(); // keep files in memory buffer
const upload = multer({ storage });

export const uploadProductImages = upload.array('images', 5); // max 5 images

export const handleProductImageUpload = async (req, res, next) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const imageUrls = [];

    for (const file of files) {
      const result = await uploadToS3(file.originalname, file.buffer, file.mimetype);
      imageUrls.push(result.Location); // public image URL
    }

    req.body.images = imageUrls; // inject image URLs into req.body
    next();
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Image upload failed', error });
  }
};
