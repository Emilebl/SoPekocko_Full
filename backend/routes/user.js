const express = require('express');
const router = express.Router();
const bouncer = require ("express-bouncer")(9000, 600000, 3);

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login);

module.exports = router;