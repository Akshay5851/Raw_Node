const express = require('express')
const app = express()
const port = 4000

app.get('/',(req,res)=>{
    res.send('first page working finess ')
})

app.listen(port,()=>{
    console.log('app is running fine')
})