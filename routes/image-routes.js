const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const authadminMiddleware = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-middleware');
const { imageController, fetchImagesController, deleteImageController } = require('../controllers/image-controller');

const router = express.Router();

router.post('/upload', 
    authMiddleware, 
    authadminMiddleware, 
    uploadMiddleware.single('image'), 
    imageController
);

router.get('/images', 
    authMiddleware, 
    fetchImagesController
);

router.delete('/images/delete/:id', 
    authMiddleware, 
    deleteImageController
);

module.exports = router;