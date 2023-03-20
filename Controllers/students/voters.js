const pool = require("../../Data Access/connection");

const handleErr = (err, req, res, next) => {
  res.status(400).send({ error: err.message })
}

//viewing the candidates
  const viewCandidates = (req, res) => {
    
    // const id=parseInt(req.params.id)
  
    pool.query('SELECT  c.user_id,u.username, c.picture, c.video, c.message FROM public.candidates c,public.users uWHERE u.id=c.id;', (error, results) => {
    
      res.status(200).json(results.rows)
    }),handleErr
  }
 
  const vote = (req, res) => {  

    const {user_id, picture,video,message } = req.body

  
// var today = new Date();
// var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    pool.query('INSERT INTO public.candidates(user_id,picture, video,message) VALUES ($1,$2,$3,$4)', [user_id,picture,video,message], (error, results) => {
      if (error) {
        throw error
      }
      res.status(201).send({message:"You has been successfully added your details"})
    })
    
  }
  
  module.exports = {
    viewCandidates,
    vote
  }

  


