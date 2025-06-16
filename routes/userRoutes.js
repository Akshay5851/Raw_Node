const express= require("express");
const router = express.Router();
const userController = require('./../controllers/userController');
const adminOnly = require('../middleware/adminOnly');
const authmiddleware = require('../middleware/auth_middleware');

//routes for fetching users 
router.get('/users',authmiddleware,adminOnly,userController.users);

module.exports= router;