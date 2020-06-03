const passport = require('passport')
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');

const JWT = require('jsonwebtoken')
const User = require('../models/user')
const Card = require('../models/card')
const Button = require('../models/button')
const { JWT_SECRET } = require('../config')

// create JWT
signToken = user => {
    return JWT.sign({
        iss: 'LINKUP',
        sub: user.id,
        iat: new Date().getTime(),
    }, JWT_SECRET)
}

module.exports = {

    // get users
    // need to change this to getting users from FireBase Auth. Replace code below
    index: async (req, res, next) => {
        const users = await User.find({})
        res.status(200).json(users)
    },

    signUp: async (req, res, next) => {
        // email and password
        const { email, password, username, firstname, lastname, source, updated_at, created_at, referral_code, code } = req.value.body
        
        const foundEmail = await User.findOne({ email })
        const foundUsername = await User.findOne({ username })
        if (foundEmail) { 
            return res.status(403).json({
            error: 'Email is already in use'
            });
        }
        if (foundUsername) { 
            return res.status(403).json({
            error: 'Username is already in use'
            });
        }

        const newUser = new User({ email, password, username, firstname, lastname, source, updated_at, created_at, referral_code, code })
        await newUser.save()

        const token = signToken(newUser)

        res.status(200).json ({ 
            token: token,
            'user': newUser
        })
    },

    signIn: async (req, res, next) => {
        // generate token
        const token = signToken(req.user)
        user = req.body
        res.status(200).json ({ 
            token: token,
            'user': user
        })
    },

    /*
    authGoogle: async (req, res, next) => {
        console.log("authGoogle");

        passport.authenticate('google', { scope: ["profile", "email"] });
    },

    authGoogleCb: async (req, res, next) => {
        console.log("authGoogleCb")

        passport.authenticate("google", { failureRedirect: "/", session: false }), function(req, res) {
            // Successful authentication, redirect home.
            var token = req.user.token;
            console.log(token);
            res.redirect("http://localhost:3000?token=" + token);
        }
    },

    authFacebook: async (req, res, next) => {
        passport.authenticate('facebook', { scope: ["profile", "email"] });
    },

    authFacebookCb: async (req, res, next) => {
        passport.authenticate("facebook", { failureRedirect: "/", session: false }), function(req, res) {
            // Successful authentication, redirect home.
            var token = req.user.token;
            console.log(token);
            res.redirect("http://localhost:3000?token=" + token);
        }
    },

    authTwitter: async (req, res, next) => {
        passport.authenticate('twitter', { scope: ["profile", "email"] });
    },

    authTwitterCb: async (req, res, next) => {
        passport.authenticate("twitter", { failureRedirect: "/", session: false }), function(req, res) {
            // Successful authentication, redirect home.
            var token = req.user.token;
            console.log(token);
            res.redirect("http://localhost:3000?token=" + token);
        }
    },
    */

    secret: async (req, res, next) => {
        // code here
        res.status(200).json ({ 
            secret: 'resource'
        })
    },

    // add new users (DELETING THIS ROUTE/METHOD)
    newUser: async (req, res, next) => {
        const newUser = new User(req.body)
        
        const user = await newUser.save();
        res.status(201).json({ 'Added': user })
    },

    getUser: async (req, res, next) => {
        const userId = req.params.userId
        
        //Mongo function to get userId
        user = await User.findById(userId)
        res.status(200).json(user)
    },

    replaceUser: async (req,res, next) => {
        // request must include all fields: need to add validation     
        const userId = req.params.userId;
        const newUser = req.body;

        user = await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json(user);
    },

    updateUser: async (req,res, next) => {
        // request can include any number of fields
        const userId = req.params.userId
        const newUser = req.body

        user = await User.findByIdAndUpdate(userId, newUser);
        res.status(200).json(user);
    },

    deleteUser: async (req, res, next) => {
        const userId = req.params.userId
        user = await User.findByIdAndDelete(userId)
        res.status(200).json(user)
    },

    getCards: async (req, res, next) => {
        const userId = req.params.userId
        const user = await User.findById(userId).populate('cards')
        res.status(200).json(user.cards)
    },

    newCard: async (req, res, next) => {
        const userId = req.params.userId
        // create new card
        const newCard = new Card(req.body)
        // get user
        const user = await User.findById(userId)
        // assign card to user
        newCard.account = user
        // save the card
        await newCard.save()
        // add card to user's account
        user.cards.push(newCard)
        // save user
        await user.save()
        res.status(201).json(newCard)
    },

    getCard: async (req, res, next) => {
        const cardId = req.params.cardId

        card = await Card.findById(cardId)
        res.status(200).json(card)
    },

    replaceCard: async (req, res, next) => {
        // request must include all fields: need to add validation      
        const cardId = req.params.cardId
        const newCard = req.body

        card = await Card.findByIdAndUpdate(cardId, newCard)
        res.status(200).json(card)
    },

    updateCard: async (req, res, next) => {
        // request must include all fields      
        const cardId = req.params.cardId
        const newCard = req.body

        card = await Card.findByIdAndUpdate(cardId, newCard)
        res.status(200).json(card)
    },

    deleteCard: async (req, res, next) => {
        const cardId = req.params.cardId
        card = await Card.findByIdAndDelete(cardId)
        res.status(200).json(card)
    },

    getButtons: async (req, res, next) => {
        const cardId = req.params.cardId
        const card = await Card.findById(cardId).populate('buttons')
        res.status(200).json(card.buttons)
    },

    newButton: async (req, res, next) => {
        const cardId = req.params.cardId

        // create new button
        const newButton = new Button(req.body)
        // get card
        const card = await Card.findById(cardId)
        // assign button to card
        newButton.buttonGroup = card
        // save the button
        await newButton.save()
        // add button to card
        card.buttons.push(newButton)
        // save card
        await card.save()
        res.status(201).json(newButton)
    },

    getButton: async (req, res, next) => {
        const buttonId = req.params.buttonId;
        button = await Button.findById(buttonId)

        res.status(200).json({
            success: true,
            result: button
        });
    },

    replaceButton: async (req, res, next) => {
        // request must include all fields, validation required      
        const buttonId = req.params.buttonId
        const newButton = req.body

        button = await Button.findByIdAndUpdate(buttonId, newButton)
        res.status(200).json({
            success: true,
            result: button
        })
    },

    updateButton: async (req, res, next) => {
        // request can include any number of fields
        const buttonId = req.params.buttonId
        const newButton = req.body

        button = await Button.findByIdAndUpdate(buttonId, newButton)
        res.status(200).json(button)
    },

    deleteButton: async (req, res, next) => {
        const buttonId = req.params.buttonId
        button = await Button.findByIdAndDelete(buttonId)
        res.status(200).json(button)
    },

    resetPwd: async (req, res, next) => {
        User.findOne({"pin": req.body.pin}).then(function(user) {
            if(!user) {
                return res.sendStatus(401).json({message: "Incorrect PIN"}); 
            }
        
            user.password = req.body.password;
            user.save().then(function() {
              return res.json(user);
            });
        }).catch(next);
    },

    forgotPwd: async (req, res, next) => {
        User.findOne({email: req.body.email}).then(function(user){
            if(!user){ return res.sendStatus(422).json({message: "User not found"}); }
    
            user.pin = getPin();

            user.save().then(function(){
                // remove pin after
                setTimeout(() => {
                    user.pin = "";
                    user.save();
                }, 60000 * 5)
        
                // set email format
                var emailHtml = fs.readFileSync(__dirname + '/../public/reset-password-email.html', {encoding:'utf-8'});
                emailHtml = emailHtml.replace("385098", user.pin);
                
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: false,
                    socketTimeout: 5000,
                    logger: true,
                    auth: {
                        user: process.env.EMAIL_FROM,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
        
                var mailOptions = {
                    from: process.env.EMAIL_FROM,
                    to: req.body.email,
                    subject: 'Linkup: Reset Password',
                    html: emailHtml
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        return res.json({"result": "failed"});
                    } else {
                        console.log('Email sent: ' + info.response);
                        return res.json({"result": "success"});
                    }
                });
            });
        }).catch(next);
    }
};

function getPin() {
    var pin = "";
    for(i = 0; i < 6; i ++) {
        pin = pin + parseInt(Math.random() * 10);
    }
    return pin;
}