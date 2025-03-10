const cloudinary = require('cloudinary').v2
const router = require('express').Router()
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const FileModel = require('../Models/File');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'pdfs',
      resource_type: 'raw', // Important for PDFs
      allowed_formats: ['pdf'],
      public_id: (req, file) => `${Date.now()}-${file.originalname}`
    }
  });
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed!'), false);
      }
    }
  });
  
  
  router.post('/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const fileModel = new FileModel({title: req.body.title, path: req.file.path, expiresAt: req.body.expiresAt})   
      await fileModel.save()
  
      res.status(200).json({
        message: 'File uploaded successfully',
        success: true
      });

    } catch (error) {

      console.error('Cloudinary upload error:', error);
      res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
  });

  router.get('/files', async (req, res) => {
    try {
      const files = await FileModel.find().sort({ posted: -1 }); // Sort by newest first
      res.status(200).json(files);
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ error: 'Failed to fetch files' });
    }
  });

  // Delete file route (MongoDB only)
router.delete('/delete/:id', async (req, res) => {
    try {
      // Find and delete the file by ID
      const deletedFile = await FileModel.findByIdAndDelete(req.params.id);
      
      if (!deletedFile) {
        return res.status(404).json({ 
          success: false, 
          message: 'File not found' 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'File deleted successfully from database',
        deletedFile: {
          id: deletedFile._id,
          title: deletedFile.title
        }
      });
      
    } catch (error) {
      console.error('Error deleting file from database:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error deleting file', 
        error: error.message 
      });
    }
  });
 
  
  module.exports = router;