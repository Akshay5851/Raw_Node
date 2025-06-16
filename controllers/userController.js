const connection= require('./../connection');
const tokenblacklist= require('./../middleware/tokenblacklist');


 // Protected Route to fetch all users

exports.users= (req,res)=>{
    const con=connection.query('select * from users',(err,result)=>{
        if(err){
          console.log('unable to find data record from table having error'+err);
          return;
        }
         return res.status(200).json(result);
      })
}