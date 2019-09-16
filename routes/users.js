const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { catchErrors } = require('../config/errorHandlers');
const User = require('../models/user');
const { forwardAuthenticated, ensureAuthenticated, ensureAdministrator } = require('../config/auth');
//controllers
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/DashboardController');


/**
 * Routes here
*/
router.get('/login', forwardAuthenticated, authController.loginPage);
router.get('/register', authController.registerPage);
router.post('/register', authController.validateRegister, authController.register);
router.post('/login',authController.login, authController.rememberMe, authController.loginRedirect);
router.get('/logout', authController.logout);

//not in use now
router.get('/reset_account', forwardAuthenticated, authController.resetPasswordPage);
router.post('/account/forgot',catchErrors(authController.forgot));
router.get('/account/reset/:token',catchErrors(authController.reset));
router.post('/account/reset/:token',authController.confirmedPasswords, authController.update);

//this in use
router.post('/account/reset_profile', dashboardController.inputSanctification, dashboardController.editAccount);

router.get('/facebook', passport.authenticate('facebookAuth'));
router.get('/return', passport.authenticate('facebookAuth', {successRedirect:'/dashboard',failureRedirect:'/users/login'}));

module.exports = router;
