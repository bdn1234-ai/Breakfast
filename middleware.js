const { breakfastSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Breakfast = require('./models/breakfasts');
const Review = require('./models/reviews');
const Restaurant = require('./models/restaurants')
const catchAsync = require('./utils/catchAsync.js');

module.exports.validateBreakfast = (req, res, next) => {
    const { error } = breakfastSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', 'You need login first!');
        res.redirect("/login");
    }
}

module.exports.isBreakfastAuthor = async (req, res, next) => {
    const { id } = req.params;
    const breakfast = await Breakfast.findById(id);
    if (!breakfast.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        res.redirect(`/breakfasts/${breakfast._id}`);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        res.redirect(`/breakfasts/${breakfast._id}`);
    } else {
        next();
    }
}

module.exports.isShopOwner = async (req, res, next) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        res.redirect(`/restaurants/${restaurant._id}`);
    } else {
        next();
    }
}
