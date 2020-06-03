const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const waitlistSchema = new Schema({
    name: String,
    email: String,
    role: String,
    date: {
        type: Date, 
        default: Date.now
    }
});

const WaitlistUser = mongoose.model('waitlistUser', waitlistSchema);
module.exports = WaitlistUser;