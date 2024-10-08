import express from 'express';
import {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    getAllUsers,
    deleteUser,
    getPaginatedUsers,
    uploadImage,
    getImage,
    resetPasswordPage,
} from '../controllers/userController.js';

const router = express.Router();

// User Registration
router.post('/signup', registerUser); // Changed from /register to /signup

// User Login
router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);

// Reset Password (POST to update the password)
router.post('/reset-password/:id/:token', resetPassword);

// Render Forgot Password Page (GET)
// Render Forgot Password Page (GET)
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});


// Render Reset Password Page (GET)
router.get('/reset-password/:id/:token', resetPasswordPage);


// Get All Users
router.get('/users', getAllUsers);

// Get Paginated Users
router.get('/users/paginated', getPaginatedUsers);

// Delete User
router.delete('/users/delete', deleteUser);

// Upload Image
router.post('/upload-image', uploadImage);

// Get Images
router.get('/images', getImage);



// Export the router
export default router;
