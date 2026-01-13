const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const healthCheck = (req, res) => {
  res.json({ status: 'API is healthy' })
}


const createUser = async (req, res, next) => {
  if (!req.body.name) {
    const error = new Error('Name is required');
    error.statusCode = 400;
    return next(error);
  }

  const response = await userModel.create(req.body);

  if (response) {
    res.json({
      message: 'User created',
      data: req.body
    });
  }
  else {
    res.json({
      message: 'Something went wrong',
      data: req.body
    });
  }

};


const register = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await userModel.create({
      ...req.body,
      password: hashedPassword
    });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};


const login = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch){
     res.json({
      message:"Invalid credentials"
     })
     return;
    } 

    const token = jwt.sign(
      { id: user.id, role: user.role },
      'SECRET_KEY',
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};

const profile = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email })
    if (!user) {
      res.status(401).json({
        status: false,
        message: "Not Found"
      })
    }

    res.json({
      success: true,
      user: user.email
    })
  }

  catch (err) {
    console.log("err", err)
    next(err);
  }

}



module.exports = { healthCheck, createUser, register, login, profile }