const express = require('express')
const connection= require('./connection')
//const con = require('./users/view')
const app = express()
const port = 4000

app.get('/',(req,res)=>{
    res.send('first page working finess')
})


app.get('/users',(req,res)=>{
    const con=connection.query('select * from users',(err,result)=>{
        if(err){
          console.log('unable to find data record from table having error'+err);
          return;
        }
        console.log('query is succesful')
         res.json(result);
        console.log(result)
      })
})

app.listen(port,()=>{
    console.log('app is running fine')
})