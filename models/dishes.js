const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const dishSchema = new Schema({
    title: String,
    price: Number,
    image: 
        {
            url: String,
            filename: String
        }
    
});

module.exports = mongoose.model('dish', dishSchema);