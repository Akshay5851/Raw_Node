const express = require('express');
const connection= require('./connection');
const jwt = require('jsonwebtoken');
const bodyparser = require('body-parser');
const becrypt = require('bcryptjs');
const app = express();
const authmiddleware= require('./middleware/auth_middleware');
const tokenblacklist= require('./middleware/tokenblacklist');
//app.use(bodyparser.json());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
const port= process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const adminOnly = require('./middleware/adminOnly');


app.get('/',(req,res)=>{
    res.send('first page working finess')
})

// Route to Register a new user

app.post('/register',(req,res)=>{
  try{
    const {username,email,password}= req.body;
    
        connection.query('select * from users where email = ?',[email],(err,result)=>{

          if (err) {
          return res.status(500).json({ error: "Database error during email check", details: err });
          }
          if (result.length > 0) {
          return res.status(400).json({ message: "Email already registered" });
          }
          
        })
        if (!username || !password) {
              return res.status(400).json({ error: 'Username and password are required' });
            }
      try{  
        async function registeruser(username,email,password){
            const hashpassword = await becrypt.hash(password, 10);
            
            connection.query(`insert into users (username,email,password) values( ?,?,?)`,[username,email,hashpassword],(err,result)=>{
              if(err){
                return res.status(500).json({ error: "Database error during user insertion", details: err });
              }
              
                return res.status(201).json({ message: "User successfully registered", userId: result.insertId });
            
          })
          

        }
        registeruser(username,email,password);
        }catch(hasherr){
             return res.status(501).json({error: "Error while hashing password"})
        }

    
      }
      catch(error){
        res.status(500).json({ error: "Unexpected server error", details: error.message });
      }

})

// Route to log in a user

app.post('/login', (req,res)=>{

    const {email,password}=req.body;
      if(!email||!password){
        return res.status(400).json({message: "Email and password are required"});
      }
   
     const cleanedEmail= email.trim().toLowerCase();
     connection.query(`select * from users where email = ?`,[cleanedEmail],async (err,result)=>{
    
      if(err){
            return res.status(401).json({message: "Database error please check your query"})
      }
        
      if(result.length > 0){
      
        const user= result[0];
             // Compare the provided password with the stored hash
            try {

              const isPasswordValid = await becrypt.compare(password, user.password);
      
              if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
              }
              const payload = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
              };
              const token= jwt.sign(payload,JWT_SECRET,{expiresIn: '1h'});
             
              // If the password is valid, return a success response
              return res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email },token: token });
            } catch (compareError) {
              return res.status(500).json({ error: "Error comparing passwords", details: compareError.message });
            }
          }else{
            return res.status(402).json({message: "No user found or invalid email"});
          }
        
   })
   
})


// Logout endpoint
app.post('/logout', authmiddleware, (req, res) => {
  const authHeader = req.header('authorization');

  if (!authHeader) {
    return res.status(400).json({ message: 'No token provided' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  // Add the token to the blacklist
  tokenblacklist.add(token);
  const blacklistArray = Array.from(tokenblacklist);
  return res.json({ message: 'Logged out successfully' , token: blacklistArray});
});

 // Protected Route to fetch all users

app.get('/admin/users',authmiddleware,adminOnly,(req,res)=>{
    const con=connection.query('select * from users',(err,result)=>{
        if(err){
          console.log('unable to find data record from table having error'+err);
          return;
        }
         return res.status(200).json(result);
      })
})

app.listen(port,()=>{
    console.log('app is running fine')
})