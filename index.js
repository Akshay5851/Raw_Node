const express = require('express');
const connection= require('./connection');
//const con = require('./users/view')
const jwt = require('jsonwebtoken');
const bodyparser = require('body-parser');
const becrypt = require('bcryptjs');
const app = express();
const port= process.env.PORT;
app.use(bodyparser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Home page route

app.get('/',(req,res)=>{
    res.send('first page working finess')
})

// Route to Register a new user

app.post('/register',(req,res)=>{
  try{
    const {username,email,password}= req.body;
    //const cleanedEmail = email.trim().toLowerCase();
    
    //console.log(cleanedEmail);
    connection.query('select * from users where email = ?',[email],(err,result)=>{

      if (err) {
      return res.status(500).json({ error: "Database error during email check", details: err });
      }
      //console.log(result);
      if (result.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
      }
      
    })
    
      connection.query(`insert into users (username,email,password) values( ?,?,?)`,[username,email,password],(err,result)=>{
        if(err){
          return res.status(500).json({ error: "Database error during user insertion", details: err });
          //console.log('please fix this error err',err)
        }else{
         // console.log(result)
          return res.status(201).json({ message: "User successfully registered", userId: result.insertId });
        }
      })
    
  }
    catch(error){

      res.status(500).json({ error: "Unexpected server error", details: error.message });
    }

})

// Route to log in a user

app.post('/login',(req,res)=>{

   const {email,password}=req.body;
   if(!email||!password){
    return res.status(400).json({message: "Email and password are required"});
   }
   
   const cleanedEmail= email.trim().toLowerCase()
   connection.query(`select * from users where email = ?`,[cleanedEmail],(err,result)=>{
    
    if(err){
    return res.status(401),json({message: "email or password is incorrect"})
    }
   })
   

})

// Route to fetch all users

app.get('/users',(req,res)=>{
    const con=connection.query('select * from users',(err,result)=>{
        if(err){
          console.log('unable to find data record from table having error'+err);
          return;
        }
        console.log('query is succesful')
         return res.json(result);
        //console.log(result)
      })
})

app.listen(port,()=>{
    console.log('app is running fine')
})