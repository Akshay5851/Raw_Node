const express = require('express')
const routes = express.Router()
const userModel = ('../model/userModel')

class userController {

    static getUser(req,res){
    const users = userModel.getalluser;
    res.render()
    }
}