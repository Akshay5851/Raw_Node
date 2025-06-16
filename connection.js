const mysql= require('mysql')

const connection= mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

connection.connect((err)=>{
    if(err){
        console.log('databasec connection failed have this error' +err);
        return;
    } 
    console.log('databse connection is succesfull')
    
});

module.exports= connection;