const express = require('express');
const router = express.Router();
const bouncer = require ("express-bouncer")(9000, 600000, 3); 
// the express-bouncer module prevents brute force attacks, it restricts the user to only 3 attempts to login
// If the user uses these 3 attempts, he will be blocked for a duration between 9000 and 600000 milliseconds

const userCtrl = require('../controllers/user'); // We need our controllers to indicate the actions of each route

router.post('/signup', userCtrl.signup); // Route to signup on the application
router.post('/login', bouncer.block, userCtrl.login); // Route to login on the application, with the use of the bouncer module to avoid brute force attack

module.exports = router; // We export the routes so that they can be called in our app.js