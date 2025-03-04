const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createDefaultUser = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('Connected to MongoDB. Checking for existing user...');
    
    // تحقق مما إذا كان المستخدم موجود
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!existingUser) {
      console.log('Creating default user...');
      const defaultUser = new User({
        name: 'مدير النظام',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });

      await defaultUser.save();
      console.log('Default user created successfully!');
    } else {
      console.log('Default user already exists.');
    }

  } catch (error) {
    console.error('Error creating default user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createDefaultUser(); 