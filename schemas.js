const Joi = require('joi');
const breakfast = require('./models/breakfasts');
const review = require('./models/reviews');

module.exports.breakfastSchema = Joi.object({
    breakfast: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        phone: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0),
        body: Joi.string().required()
    }).required()
})

