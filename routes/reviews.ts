import express from 'express';
import { validateReview } from '../middlewares/validateReview';
import catchAsync from '../utils/catchAsync';
import ExpressError from '../utils/expressError';
import Campground from '../models/campground';
import Review from '../models/review'; // Importando o modelo de Review
import chalk from 'chalk';

const router = express.Router({ mergeParams: true });




router.post('/', validateReview, catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    throw new ExpressError('Campground not found', 404);
  }
  const review = new Review(req.body.review);
  campground.reviews.push(review as any); 
  await review.save();
  await campground.save();
  console.log(chalk.green('Review successfully added!'));
  req.flash('success', 'Review successfully added!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

// Método DELETE para remover um review
router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(req.params.reviewId);
  console.log(chalk.red('Review deleted successfully!'));
  req.flash('success', 'Review successfully deleted!');
  res.redirect(`/campgrounds/${id}`);
}));

export default router;
