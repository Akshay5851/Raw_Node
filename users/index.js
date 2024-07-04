const connection= require('../connection')

// fetching data from database

const con=connection.query('select * from users',(err,result)=>{
    if(err){
      console.log('unable to find data record from table having error'+err);
      res.status(500).send('eror occured');
      return;
    }
    console.log('query is succesful')
    res.json(result);
    console.log(result)
  })

module.exports =con;