import mongoose from 'mongoose';

const ImageDetailsSchema = new mongoose.Schema({
    image: String,
});

const ImageDetails = mongoose.model('ImageDetails', ImageDetailsSchema);
export default ImageDetails;
