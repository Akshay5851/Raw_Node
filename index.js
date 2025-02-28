const express = require('express');
const connection= require('./connection');
//const con = require('./users/view')
const jwt = require('jsonwebtoken');
const bodyparser = require('body-parser');
//const becrypt = require('bcryptjs');
const app = express();
const authmiddleware= require('./middleware/auth_middleware');
app.use(bodyparser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
const port= process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
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
            return res.status(401),json({message: "Database error please check your query"})
      }
        if(result.length > 0 || result.email == email){
          //console.log("found the email");
          const token= jwt.sign({email: result.email},JWT_SECRET,{expiresIn: '1h'});
          res.json({token});
        }
   })
   
    
})

 // Protected Route to fetch all users

app.get('/users',authmiddleware,(req,res)=>{
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