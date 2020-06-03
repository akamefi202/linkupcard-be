const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    image_1: {
        type: String,
        required: true,
        default: "www.google.ca",
    },
    image_2: {
        type: String,
    },
    bg_color: {
        type: String,
        required: true,
        default: "#FFF"
    },
    title: {
        type: String,
        default: "" // Hey, it's ${firstname}!
    },
    title_fontSize: {
        type: String,
        default: "45px"
    },
    title_color: {
        type: String,
        default: "#000"
    },
    desc: {
        type: String,
        default: "Add something cool about yourself here!"
    },
    desc_color: {
        type: String,
        default:  "#000"
    },
    // social icons
    facebook: {
        type: String,
        color: {
            type: String,
            default: "#3b5999"
        },
        clicks: [{
            type: Number,
            date: Date,
        }]
    },
    twitter: {
        type: String,
        color: {
            type: String,
            default: "#55acee"
        },
        clicks: [{
            type: Number,
            date: Date,
        }]
    },
    linkedin: {
        type: String,
        color: {
            type: String,
            default: "#0077B5"
        },
        clicks: [{
            type: Number,
            date: Date,
        }]
    }, 
    instagram: {
        type: String,
        color: {
            type: String,
            default: "#e4405f"
        },
        clicks: [{
            type: Number,
            date: Date,
        }]
    },
    youtube: {
        type: String,
        color: {
            type: String,
            default: "#cd201f"
        },
        clicks: [{
            type: Number,
            date: Date,
        }]
    },
    spotify: {
        type: String,
        color: {
            type: String,
            default: "#00c300"
        },
        clicks: [{
            type: Number,
            date: Date,
        }]
    },
    blogger: {
        type: String,
        color: {
            type: String,
            default: "#f57d00"
        },
        clicks: [{
            type: Number,
            date: Date,
        }]
    },
    snapchat: {
        type: String,
        color: {
            type: String,
            default: "#FFFC00"
        },
        clicks: [{
            type: Number,
            date: Date,
        }]
    },
    tiktok: {
        type: String,
        color: {
            type: String,
            default: "#46D4D1" 
        },
        clicks: [{
            type: Number,
            date: Date,
        }]
    },
    footer_text: {
        type: String,
        color: {
            type: String,
            default: "#000" 
        },
        clicks: [{
            type: Number,
            date: Date,
        }]
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    buttons: [{
        type: Schema.Types.ObjectId,
        ref: 'button'
    }],
    created_at: {
        type: Date, 
        default: Date.now
    },
    public: { // indicates whether the card link is private (false) or public (true)
        type: Boolean,
        default: false 
    },
    updated_at: {
        type: Date // should be blank so that we can indentify there is no update 
    },
});

const Card = mongoose.model('card', cardSchema);
module.exports = Card;