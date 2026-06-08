const mongoose = require('mongoose');

const uri = 'mongodb://agrawalbhavya:admin@ac-8ydfdox-shard-00-00.3orx8wx.mongodb.net:27017,ac-8ydfdox-shard-00-01.3orx8wx.mongodb.net:27017,ac-8ydfdox-shard-00-02.3orx8wx.mongodb.net:27017/?ssl=true&replicaSet=atlas-j4fqti-shard-0&authSource=admin&appName=mvc-form';

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

module.exports = connectDB;