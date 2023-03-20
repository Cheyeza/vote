const bcrypt = require("bcrypt");
const md5 = require("md5");
const pool = require("../../Data Access/connection")

// const client = require("../config/database");

const jwt = require("jsonwebtoken");


const passengerLogin = (req, res) => {


    let { email, password } = req.body; 
   
  const hashed_password = md5(password.toString())

  pool.query('SELECT * FROM public.users WHERE email= $1' ,[email],(error, results)=> {


    if(results.rowCount === 0){

      res.send('Email not found')

     }else{
     
      pool.query('SELECT * FROM public.users WHERE email= $1 AND password = $2' ,[email,hashed_password],(error, results)=> {
        //console.log(results.length)
        if (results.rowCount > 0) {
        
        //res.send('success')
           let token = jwt.sign({
             data: results 
            }, 'sgdfiuejsncksdncoihfoiwefwkwoidwnw',{
            algorithm: 'HS256',
            expiresIn:120
           })
    
           
           res.status(200).json({token: token})
          // res.send({ status: 1, data: results, token: token });
      
        }else{
          res.send('invalid login details')
        }
        });


     }
  });



}
module.exports = {
    passengerLogin
}