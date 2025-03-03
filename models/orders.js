const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const order = new Schema({
    dishes: [
        {
            title: String,
            quantity: Number
        }
    ],
    price: Number,
    date: Date,
    isSent: Boolean,
    room: String,
    floor: Number,
    note: String, 
    name: String,
    phone: String
});
//need phone, name and of receiver

module.exports = mongoose.model('order', order);