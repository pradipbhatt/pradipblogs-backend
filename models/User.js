import mongoose from 'mongoose';

// User schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    userImage: {
        type: String,
        default: '',
    },
    isAdmin: {
        type: Boolean,
        default: false,  // Regular user by default
    }
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

export default mongoose.model('User', userSchema);
