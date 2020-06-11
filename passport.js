const passport = require('passport')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const { ExtractJwt } = require('passport-jwt')
const {  JWT_SECRET } = require('./config/index')
const User = require('./models/user')

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

// JWT Strategy
passport.use(new JwtStrategy ({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        // find user specified in token
        const user = await User.findById(payload.sub)
        // if user doesn't exist
        if (!user) {
            return done(null, false)
        }
        // otherwise return user
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

// Local Strategy
/*
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (username, password, done) =>  {
    try {
        // Find the user given the email
        const user = await User.findOne({ email: username })

        // if not, handle
        if (!user) {
            return done (null, false, {errors: {'email or password': 'is invalid'}})
        }

        // if found, check if password is correct
        const isMatch = await user.isValidPassword(password)

        // if not, handle it
        if (!isMatch) {
            return done(null, false, {errors: {'email or password': 'is invalid'}})
        }

        // otherwise,  return the user
        done(null, user)
    }
    catch(error) {
        done(error, false)
    }
    
}))*/

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(username, password, done) {
    User.findOne({ email: username 
    }).then(function(user) {
        if (!user || !user.isValidPassword(password)) {
            return done (null, false, {errors: {'email or password': 'is invalid'}})
        }

        return done(null, user);
    }).catch(done);
}))

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: "",
    clientSecret: "",
    callbackURL: process.env.SERVER_URL + "/users/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
    var userData = {
        email: profile.emails[0].value,
        username: profile.displayName,
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        password: "password",
        source: "google",
        token: accessToken
    };

    const newUser = new User(userData);
    newUser.save().catch(function(){});
    done(null, userData);
}
));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: "",
    clientSecret: "",
    callbackURL: process.env.SERVER_URL + "/users/auth/facebook/callback"
},
function(accessToken, refreshToken, profile, done) {
    var userData = {
        email: profile.email,
    };
    done(null, userData);
}
));

// Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: "",
    consumerSecret: "",
    callbackURL: process.env.SERVER_URL + "/users/auth/twitter/callback"
},
function(accessToken, refreshToken, profile, done) {
    console.log(profile);

    var spaceIndex = profile.displayName.indexOf(' ');

    var userData = {
        email: profile.username + "@gmail.com",
        username: profile.username,
        firstname: profile.displayName.substring(0, spaceIndex),
        lastname: profile.displayName.substring(spaceIndex + 1, profile.displayName.length),
        password: "password",
        source: "twitter",
        token: accessToken

    };

    const newUser = new User(userData)
    newUser.save().catch(function(){})
    done(null, userData);
}
));