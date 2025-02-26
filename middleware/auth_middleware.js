const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

const authmiddleware = (req,res,next)=>{
    const token= req.header('authorisation')?.replace('bearer' ,'');

    if(!token){
        return res.status(401).json({message: 'Access denied ,token not found'});

    }
    try{
        const decode = jwt.verify(token,JWT_SECRET)
        req.user= decode;
        next()
    }catch(err){
        res.status(400).json({message: 'Invalid token'})
    }
}

module.exports= authmiddleware;

