import mongoose, {Document} from "mongoose" 

const reviewSchema = new mongoose.Schema({
    body: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
