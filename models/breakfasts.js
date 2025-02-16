const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./reviews');
const User = require('./users');

const breakfastSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    location: String,
    phone: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'review'
        }
    ],
    date: Date
})


breakfastSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Breakfast', breakfastSchema);

