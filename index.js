require('dotenv').config()
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port= process.env.PORT;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use('/auth', authRoutes);
app.use('/admin', userRoutes);
app.get('/akshay',(req,res)=>{
  res.send("hello akshay")
})

app.listen(port,()=>{
    console.log('app is running fine')
})