const healthCheck = (req , res)=>{
    res.json({status:'API is healthy'})
}


const createUser = (req, res, next) => {
  if (!req.body.name) {
    const error = new Error('Name is required');
    error.statusCode = 400;
    return next(error);
  }

  res.json({
    message: 'User created',
    data: req.body
  });
};



module.exports={healthCheck,createUser}