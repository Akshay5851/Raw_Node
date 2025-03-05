const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
// In-memory token blacklist
const tokenblacklist = require("./tokenblacklist");

const authmiddleware = (req,res,next)=>{
   //console.log(req.headers);
   const authHeader = req.header('authorization'); // Correct header spelling

   if (!authHeader) {
       return res.status(401).json({ message: 'Access denied, token not found' });
   }

   // Extract token by removing "Bearer " (case insensitive)
   const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
//    console.log(token);
   //console.log(tokenblacklist);
   // Check if the token is blacklisted
    if (tokenblacklist.has(token)) {
        return res.status(401).json({ message: 'Token is invalid (logged out)' });
    }

   try {
       const decoded = jwt.verify(token, JWT_SECRET);
       req.user = decoded;
       next();
   } catch (err) {
       res.status(400).json({ message: 'Invalid token', error: err });
   }
}

module.exports= authmiddleware;

