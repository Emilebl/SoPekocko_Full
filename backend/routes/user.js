const express = require('express');
const router = express.Router();
const bouncer = require ("express-bouncer")(9000, 600000, 3); 
// the express-bouncer module prevents brute force attacks, it restricts the user to only 3 attempts to login
// If the user uses these 3 attempts, he will be blocked for a duration between 9000 and 600000 milliseconds

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login); // Execution of the bouncer module on the login route

module.exports = router;