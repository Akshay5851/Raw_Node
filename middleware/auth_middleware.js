const jwt = require('jsonwebtoken');
const express = require('express');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

const authmiddleware = (req,res,next)=>{
   //console.log(req.headers);
   const authHeader = req.header('authorization'); // Correct header spelling

   if (!authHeader) {
       return res.status(401).json({ message: 'Access denied, token not found' });
   }

   // Extract token by removing "Bearer " (case insensitive)
   const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

   try {
       const decoded = jwt.verify(token, JWT_SECRET);
       req.user = decoded;
       next();
   } catch (err) {
       res.status(400).json({ message: 'Invalid token' });
   }
}

module.exports= authmiddleware;

