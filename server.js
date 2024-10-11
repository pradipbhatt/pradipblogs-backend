import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import blogPostRoutes from './routes/blogPostRoutes.js'; // Import blog post routes

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUrl = "mongodb://localhost:27017/pradipblogs";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', './views'); // Specify the views directory

// Suppress Mongoose strictQuery warning and set it to false for backward compatibility
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to database"))
    .catch((error) => console.error("Database connection error:", error));

// Routes
app.use('/api', userRoutes);
app.use('/api', blogPostRoutes); // Blog post routes

// Start server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
