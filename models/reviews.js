const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users');

const reviewSchema = new Schema({
    rating: Number,
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('review', reviewSchema);