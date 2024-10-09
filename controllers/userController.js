import UserModel from '../models/User.js'; // Ensure path is correct
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Images from '../models/imageDetails.js'; // Assuming an Image model exists

// Register User
export const registerUser = async (req, res) => {
    const { fullname, email, password,  } = req.body;

    if (!password || !fullname || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ fullname, email, password: hashedPassword,  });
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: "25m" });
        return res.json({ status: "ok", token }); // Only returning token
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const oldUser = await UserModel.findOne({ email });
        if (!oldUser) {
            return res.json({ status: "User not available" });
        }

        const secret = process.env.JWT_SECRET + oldUser.password;
        const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "10m" });

        const link = `https://pradipblogs-backend.onrender.com/api/reset-password/${oldUser._id}/${token}`;

        // Set up nodemailer transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS // Your email password or app password
            }
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            text: `Click on the link to reset your password: ${link}`,
        });

        res.json({ status: "ok", message: "Password reset link sent to your email!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};

// Reset Password (POST to update the password)
export const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const oldUser = await UserModel.findOne({ _id: id });
        if (!oldUser) {
            return res.status(400).json({ status: "User not found" });
        }

        const secret = process.env.JWT_SECRET + oldUser.password;
        jwt.verify(token, secret, async (err) => {
            if (err) {
                return res.status(403).json({ status: "Invalid token or token expired" });
            }

            // Update the user's password
            const hashedPassword = await bcrypt.hash(password, 10);
            oldUser.password = hashedPassword;
            await oldUser.save();

            // Render the success page
            res.render('reset-success');
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};


// Get All Users
export const getAllUsers = async (req, res) => {
    let query = {};
    const searchData = req.query.search;

    if (searchData) {
        query = {
            $or: [
                { fullname: { $regex: searchData, $options: "i" } },
                { email: { $regex: searchData, $options: "i" } },
            ],
        };
    }

    try {
        const allUsers = await UserModel.find(query);
        res.json({ status: "ok", data: allUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    const { userid } = req.body;
    try {
        const result = await UserModel.deleteOne({ _id: userid });
        if (result.deletedCount === 0) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        res.json({ status: "ok", message: "User deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};

// Get Paginated Users
export const getPaginatedUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to 1
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const startIndex = (page - 1) * limit;

    try {
        const allUsers = await UserModel.find({});
        const results = {
            totalUser: allUsers.length,
            pageCount: Math.ceil(allUsers.length / limit),
            result: allUsers.slice(startIndex, startIndex + limit),
        };

        if (startIndex + limit < allUsers.length) {
            results.next = { page: page + 1 };
        }
        if (startIndex > 0) {
            results.prev = { page: page - 1 };
        }

        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};

// Upload Image
// Upload image
export const uploadImage = async (req, res) => {
    const { base64 } = req.body;
    try {
        const newImage = await Images.create({ image: base64 });
        res.json({ status: "ok", data: newImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};

// Get Image by ID
export const getImage = async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Images.findById(id);
        if (!image) {
            return res.status(404).json({ status: "error", message: "Image not found" });
        }
        res.json({ status: "ok", data: image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};

// Update Image by ID
export const updateImage = async (req, res) => {
    const { id } = req.params;
    const { base64 } = req.body; // Assuming you're sending the updated Base64 image in the body
    try {
        const updatedImage = await Images.findByIdAndUpdate(id, { image: base64 }, { new: true });
        if (!updatedImage) {
            return res.status(404).json({ status: "error", message: "Image not found" });
        }
        res.json({ status: "ok", data: updatedImage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};

// Delete Image by ID
export const deleteImage = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedImage = await Images.findByIdAndDelete(id);
        if (!deletedImage) {
            return res.status(404).json({ status: "error", message: "Image not found" });
        }
        res.json({ status: "ok", message: "Image deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};


// Render Reset Password Page
// Render Reset Password Page
export const resetPasswordPage = async (req, res) => {
    const { id, token } = req.params;

    try {
        const oldUser = await UserModel.findOne({ _id: id });
        if (!oldUser) {
            return res.status(400).json({ status: "User not found" });
        }

        const secret = process.env.JWT_SECRET + oldUser.password;
        jwt.verify(token, secret, (err) => {
            if (err) {
                return res.status(403).json({ status: "Invalid token or token expired" });
            }

            // Render reset.ejs with id and token as parameters
            res.render('reset', { id, token });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Server error" });
    }
};

