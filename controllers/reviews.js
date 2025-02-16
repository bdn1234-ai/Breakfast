const Breakfast = require('../models/breakfasts');
const Review = require('../models/reviews');

module.exports.createReview = async (req, res, next) => {
    const breakfast = await Breakfast.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    breakfast.reviews.push(review);
    await review.save();
    await breakfast.save();
    req.flash('success', 'Successfully create a review!');
    res.redirect(`/breakfasts/${breakfast._id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Breakfast.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(id);
    req.flash('success', 'Successfully delete review!');
    res.redirect(`/breakfasts/${id}`)
}

