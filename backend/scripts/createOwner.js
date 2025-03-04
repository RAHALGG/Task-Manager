const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function createOwner() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🟢 Connected to MongoDB');

        // التحقق من وجود owner
        const existingOwner = await User.findOne({ email: 'owner@system.com' });
        
        if (existingOwner) {
            console.log('👤 Owner already exists');
            return;
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash('owner123', 10);

        // إنشاء مستخدم جديد
        const owner = new User({
            name: 'System Owner',
            email: 'owner@system.com',
            password: hashedPassword,
            role: 'owner'
        });

        await owner.save();
        console.log('✅ Owner created successfully');
        console.log('📧 Email: owner@system.com');
        console.log('🔑 Password: owner123');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

createOwner(); 