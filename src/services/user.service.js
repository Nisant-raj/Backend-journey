const LRUCache = require('./lruCache.service.js');
const User =require('../models/user.model.js');

const userCache = new LRUCache(100); // cache 100 users

 const getUserByIdService = async (userId) => {

  console.log("in user service",userId)

  // 1️⃣ Check cache first
  const cachedUser = userCache.get(userId);
  if (cachedUser !== -1) {
    console.log("Returning from lru cache")
    return { source: 'cache', data: cachedUser };
  }

  // 2️⃣ Fetch from DB
  const user = await User.findById({_id:userId});
  if (!user) return null;

  // 3️⃣ Store in cache
  userCache.put(userId, user);

  return { source: 'db', data: user };
};


module.exports = getUserByIdService;