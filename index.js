const express = require('express')
const con = require('./users/index');
const app = express()
const port = 4000

app.get('/',(req,res)=>{
    res.send('first page working finess')
})


app.get('/users',(req,res)=>{


})
app.listen(port,()=>{
    console.log('app is running fine')
})