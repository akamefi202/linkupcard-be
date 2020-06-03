const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buttonSchema = new Schema({
    title: {
        type: String,
        default: "Add a button and give it a title",
        required: true
    },
    title_color: {
        type: String,
        default: "#000",
        required: true
    },
    icon: String, // dimensions must be square. Reflect this in the UI for cropping
    color: {
        type: String, 
        default: "#3aa3ae",
        required: true
    },
    animation: {
        type: String, // none, shake, bounce, tilt
        default: "none",
        required: true
    },
    url: {
        type: String,
        default: "linkup.com",
        required: true
    }, 
    clicks: [{
        type: Number,
        date: Date.now,
    }],
    buttonGroup: [{
        type: Schema.Types.ObjectId,
        ref: 'card'
    }],
    created_at: {
        type: Date, 
        default: Date.now 
    },
    updated_at: {
        type: Date // should be blank so that we can indentify there is no update 
    },
});

const Button = mongoose.model('button', buttonSchema);
module.exports = Button;