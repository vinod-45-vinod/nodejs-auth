const Img = require('../models/Images');
const { uploadToCloudinary } = require('../helpers/cloudinaryHelper');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const imageController = async (req, res) => {
    try {
        console.log('req.file:', req.file);
        console.log('req.body:', req.body);
        
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // upload image to cloudinary
        const {url, publicId} = await uploadToCloudinary(req.file.path);

        // upload image url , public id along with uploaded by user id to mongodb
        const newImage = new Img({
            url: url,
            publicId: publicId,
            uploadedBy: req.user.userId  // user is from the middleware, userId is from the token payload
        });

        const savedImage = await newImage.save();
        // remove the file from local uploads folder after uploading to cloudinary
        fs.unlinkSync(req.file.path);

        res.status(201).json({
            message: 'Image uploaded successfully',
            image: savedImage   
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Some error occurred! Please try again' });
    }
};

const fetchImagesController = async (req, res) => {
    try {
        const images = await Img.find({}).populate('uploadedBy', 'username email');   
        res.status(200).json({ images });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Some error occurred! Please try again' });
    }   
};


const deleteImageController = async (req, res) => {
    try {
        const imageId = req.params.id;
        const userId = req.user.userId; // user is from the middleware

        // find the image by id
        const image = await Img.findById(imageId);
        if(!image) {
            return res.status(404).json({ message: 'Image not found' });
        }

        if(image.uploadedBy.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this image' });
        }
        // delete image from cloudinary
        await cloudinary.uploader.destroy(image.publicId); 
        // delete image from mongodb
        await Img.findByIdAndDelete(imageId);
        res.status(200).json({ message: 'Image deleted successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Some error occurred! Please try again' });
    }
};

module.exports = {
    imageController,
    fetchImagesController,
    deleteImageController
};