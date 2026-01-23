const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getUserByIdService = require('../services/user.service.js');


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
    cache.clear();
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
    if (!isMatch) {
      res.json({
        message: "Invalid credentials"
      })
      return;
    }

    // const token = jwt.sign(
    //   { id: user.id, role: user.role },
    //   'SECRET_KEY',
    //   { expiresIn: '1d' }
    // );

    const token = generateTokens(user)
    user.refreshToken = token.refreshToken;
    await user.save();
    res.json({ token });
  } catch (err) {
    next(err);
  }
};


// profile
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
      user: user
    })
  }

  catch (err) {
    console.log("err", err)
    next(err);
  }

}

JWT_SECRET = 'ABC123',
  JWT_REFRESH_SECRET = 'ABC1234'
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  const user = await userModel.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  res.json({ accessToken });
};

const cache = new Map();
const getUsers = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 1;
  const role = req.query.role || user;
  const skip = (page - 1) * limit;

  const query = {}

  if (req.query.role) {
    query.role = req.query.role;
  }


  // 🔑 Create unique cache key
  const cacheKey = JSON.stringify({ page, limit, role });

  // ✅ Check cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    return res.json(cached.data);
  }

  const users = await userModel.find(query)
    .skip(skip)
    .limit(limit);

  const total = await userModel.countDocuments(query);

  const response = {
    data: users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };

  // 💾 Save to cache
  cache.set(cacheKey, {
    data: response,
    timestamp: Date.now(),
  });


  res.json(response);
}


const getUserById = async (req, res) => {
  console.log("in controller ",req.params.id)
  const result = await getUserByIdService(req.params.id);

  if (!result) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(result);
};

module.exports = { healthCheck, createUser, register, login, profile, refresh, getUsers, getUserById }