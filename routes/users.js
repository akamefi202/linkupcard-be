const router = require('express-promise-router')();
const UsersController = require('../controllers/users');
const { validateBody, schemas } = require('../helpers/routeHelpers')
const passport = require('passport')
const passportConfig = require('../passport')
const passportSignin = passport.authenticate('local', { session: false })
const passportJWT = passport.authenticate('jwt', { session: false })

var dotenv = require('dotenv');
dotenv.config();

router.route('/')
    // get all users
    .get(UsersController.index)
    // create new user
    .post(UsersController.newUser);

router.route('/signup')
    // register new user
    .post(validateBody(schemas.authSchema), UsersController.signUp);

router.route('/signin')
    // authenticate and sign in a user
    .post(validateBody(schemas.signInSchema), passportSignin, UsersController.signIn);

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    function(req, res) {
        var token = req.user.token;
        res.redirect(process.env.CLIENT_URL + "/dashboard");
    }
);

router.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["profile", "email"] })
);

router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/", session: false }),
    function(req, res) {
        var token = req.user.token;
        res.redirect(process.env.CLIENT_URL + "/dashboard");
    }
);

router.get(
    "/auth/twitter",
    passport.authenticate("twitter")
);

router.get(
    "/auth/twitter/callback",
    passport.authenticate("twitter", { failureRedirect: "/" }),
    function(req, res) {
        var token = req.user.token;
        res.redirect(process.env.CLIENT_URL + "/dashboard");
    }
);
/*
router.route("/auth/google")
    .get(UsersController.authGoogle);

router.route("/auth/google/callback")
    .get(UsersController.authGoogleCb);

router.route('/auth/facebook')
    .get(UsersController.authFacebook);
    
router.route('/auth/facebook/callback')
    .get(UsersController.authFacebookCb);

router.route('/auth/twitter')
    .get(UsersController.authTwitter);

router.route('/auth/twitter/callback')
    .get(UsersController.authTwitterCb);
*/

router.route('/secret')
    // create new user
    .get(passportJWT, UsersController.secret);

router.route('/:userId')
    //  get user details
    .get(UsersController.getUser)
    // replace user
    .put(UsersController.replaceUser)
    // update user detail(s)
    .patch(UsersController.updateUser)
    // delete user
    .delete(UsersController.deleteUser);

router.route('/:userId/cards')
    // get all cards for the user
    .get(UsersController.getCards)
    // create new card for the user
    .post(UsersController.newCard);

router.route('/:userId/cards/:cardId')
    // get card details
    .get(UsersController.getCard)
    // replace card for the user
    .put(UsersController.replaceCard)
    // update card for the user
    .patch(UsersController.updateCard)
    // delete card for the user
    .delete(UsersController.deleteCard);

router.route('/:userId/cards/:cardId/buttons')
    // get all buttons in the card
    .get(UsersController.getButtons)
    // create new button
    .post(UsersController.newButton);

router.route('/:userId/cards/:cardId/buttons/:buttonId')
    // get button details
    .get(UsersController.getButton)
    // replace button in the card
    .put(UsersController.replaceButton)
    // update button detail(s) in the card
    .patch(UsersController.updateButton)
    // delete button in the card
    .delete(UsersController.deleteButton);

router.route('/forgotPwd')
    // forgot password and send email
    .post(UsersController.forgotPwd);

router.route('/resetPwd')
    // reset password with pin
    .post(UsersController.resetPwd);

module.exports = router;
