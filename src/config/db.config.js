const mongoose = require('mongoose');

const mongo_uri =
  'mongodb+srv://nishantraj620127_db_user:QqMEXlANQHURfFzN@cluster0.tljojp7.mongodb.net/?appName=Cluster0';

const connectDB = async () => {
  try {
    console.log("reachred",mongo_uri)
    await mongoose.connect(mongo_uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;

// const mongo_uri='mongodb+srv://nishantraj620127_db_user:St5nihjhny_123@cluster0.rrzhepw.mongodb.net/?appName=Cluster0'