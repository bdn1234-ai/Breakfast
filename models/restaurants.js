const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users');
const review = require('./reviews');
const order = require('./orders');
const dish = require('./dishes');

const restaurantSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    location: String,
    phone: String,
    description: String,
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
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'order'
        }
    ],
    dishes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'dish'
        }
    ]

})


restaurantSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
        await order.deleteMany({
            _id: {
                $in: doc.orders
            }
        });
        await dish.deleteMany({
            _id: {
                $in: doc.dishes
            }
        });
    }
})


module.exports = mongoose.model('restaurant', restaurantSchema);