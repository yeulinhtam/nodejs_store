const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId;

const User = new Schema({
    email: { type: String, unique: true },
    fullname: { type: String, required: true},
    password: { type: String},
    phone: { type: String},
    address: { type: String},
    image: { type: String},
    accessToken: { type: String},
}, {
    timestamps: true
});


module.exports = mongoose.model('User', User);