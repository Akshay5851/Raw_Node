const mysql= require('mysql')

const connection= mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'raw_node'
})

connection.connect((err)=>{
    if(err){
        console.log('databasec connection failed have this error' +err);
        return;
    } 
    console.log('databse connection is succesfull')
    
});

module.exports= connection;