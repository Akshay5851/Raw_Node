const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authmiddleware = require('../middleware/auth_middleware');

//authentication routes
router.get('/', authController.home);
router.post('/register', authController.register);
router.post('/login',authController.login);
router.post('/logout', authmiddleware,authController.logout);

module.exports = router;