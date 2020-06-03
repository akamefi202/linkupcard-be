const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    username: {
        type: String,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    }, 
    referal_code: String, // this is the code user enters in sign up form in /register
    code: String, // this needs to be a random value that gets created with user registration (5 chars of numbers and letters)
    cards: [{
        type: Schema.Types.ObjectId,
        ref: 'card'
    }],
    created_at: {
        type: Date,
        default: Date.now // not sure if this is the right way
    },
    updated_at: Date, // should be blank so that we can indentify there is no update
    // we may need to update this to store auth token of Twitter, Facebook, Google
    source: String, // local, facebook, google, twitter,
    pin: String // pin for password reset
});

userSchema.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(this.password, salt)
        this.password = passwordHash
        next()
    } 
    catch(error) {
        next(error)
    }
});

userSchema.methods.isValidPassword = async function(newPassword) {
    try {
        return bcrypt.compare(newPassword, this.password)
    } 
    catch(error) {
        throw new Error(error)
    }
};

const User = mongoose.model('user', userSchema);
module.exports = User;