const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.Cloudeinary_Name,
    api_key: process.env.Cloudeinary_API_KEY,
    api_secret: process.env.Cloudeinary_API_Secret
});

module.exports = cloudinary;