const connection= require('./../connection');
const jwt = require('jsonwebtoken');
const becrypt = require('bcryptjs');
const tokenblacklist= require('./../middleware/tokenblacklist');
const JWT_SECRET = process.env.JWT_SECRET;

exports.home= (req,res)=>{
    res.send('first page working finess')
}

// Route to Register a new user

exports.register = (req, res) => {
      const { username, email, password } = req.body;

      // Step 1: Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }

      // Step 2: Check if email already exists
      connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Database error during email check", details: err });
        }

        if (result.length > 0) {
          return res.status(400).json({ message: "Email already registered" });
        }

        // Step 3: Hash password
        try {
          const hashedPassword = await becrypt.hash(password, 10);

          // Step 4: Insert user
          connection.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            (insertErr, insertResult) => {
              if (insertErr) {
                return res.status(500).json({ error: "Database error during user insertion", details: insertErr });
              }

              return res.status(201).json({ message: "User successfully registered", userId: insertResult.insertId });
            }
          );
        } catch (hashErr) {
          return res.status(500).json({ error: "Error while hashing password", details: hashErr.message });
        }
      });
};

// Route to log in a user

exports.login= (req,res)=>{

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
   
}


// Logout endpoint
exports.logout= (req, res) => {
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
      }




