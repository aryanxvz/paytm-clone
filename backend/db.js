
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://aryanxvz:aryan0709@cluster0.qvmhxgy.mongodb.net/paytm")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        maxLength: 15,
    },
    lastName: {
        type: String,
        required: true,
        maxLength: 15,
    }
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', userSchema)
const Account = mongoose.model('Account', accountSchema)

module.exports = {
    User,
    Account
}