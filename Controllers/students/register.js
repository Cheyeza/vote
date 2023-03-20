// const  bcrypt  =  require("bcrypt");
const  md5  =  require("md5");
const  jwt  =  require("jsonwebtoken");

const pool = require("../../Data Access/connection")


const registerUser = (req, res) => {
    
    const {username,email,password} = req.body; 
  
     const hashed_password = md5(password.toString())
    
  
    if(username && email && password){
  
  
  
      pool.query('SELECT * FROM public.users WHERE email =$1',[email],function (error, results, fields){
  
        if(results.rowCount > 0)
        { 
            res.send('Email exists already')
        }
        else{
        
            const points=0;
            const active="pending";
          var user={
  
            "username":username,
            "email":email,          
            "password":hashed_password,
            "votes":points,
            "status":active

         
        }
         pool.query('INSERT INTO public.users(username, email, password,votes,status) VALUES ($1,$2,$3,$4,$5);', [user.username, user.email, user.password,user.votes,user.status], function (error, results, fields) 
          {
               if(error){
                throw error
  
               }else{
                res.send('Account created succesfully!')
               }
  
          })
  
  
          
        }
    
      });
  
    }
    
  };

module.exports = {
    registerUser
  }
