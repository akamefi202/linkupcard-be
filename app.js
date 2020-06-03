const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const waitlist = require('./routes/waitlist');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();

// get mongodb from config folder
//const {  MONGODB_URI } = require('./config/index')

mongoose.Promise = global.Promise;

const env = process.env.NODE_ENV || 'development';
const mongodbUri = env == 'development'? process.env.MONGODB_STA_URI: process.env.MONGODB_PRO_URI;

// connect to mongoDB of catch mongoose connection err
mongoose
    .connect(mongodbUri || 'mongodb://localhost:27017/linkup', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('mongoose is connected!'))
    .catch(err => console.log(err))


const app = express();

// middlewares
app.use(morgan('dev'));
app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

// Use the session middleware
app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

// Routes
app.use('/users', users);
app.use('/waitlist', waitlist); // temp only for the website

// catch 404 errors and forward them to error handler
app.use((req, res, next) => {
    const err = new Error ('Not Found');
    err.status = 404;
    next(err);
});

// Error handler function 
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err. status || 500;

    // respond to client
    res.status(status).json({
        error: {
            message: error.message
        }
    });
    console.error(err);
});

// start server
const PORT = process.env.PORT || 9000;
console.log(process.env.PORT);
app.listen(PORT, console.log(`Server is listening to port ${PORT}`));