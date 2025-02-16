const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/users');
const users = require('../controllers/users');


router.route('/register')
    .get(users.renderUserForm)
    .post(users.createAccount);

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout);

module.exports = router;