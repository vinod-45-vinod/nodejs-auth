const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        length: [3, 50]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    role: {
        type: String,
        enum: ['user', 'admin'],  // only allow user or admin roles
        default: 'user'
    }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);