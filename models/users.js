const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const restaurant = require('./restaurants');
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    floor: {
        type: Number,  
        required: true
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: "restaurant"
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);