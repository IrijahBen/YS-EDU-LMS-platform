// backend/createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User'); // Adjust path if your User model is elsewhere

// Connect to database
mongoose.connect(process.env.MONGODB_URI) // Check your .env to see if this is MONGO_URI or MONGODB_URI
    .then(() => console.log('DB Connected'))
    .catch(err => console.log(err));

const createAdmin = async () => {
    try {
        // Check if admin already exists to prevent errors
        const adminExists = await User.findOne({ email: 'admin@ysedu.com' });

        if (adminExists) {
            console.log('Admin already exists!');
            process.exit(0);
        }

        const admin = await User.create({
            name: 'YS Edu Admin',
            email: 'admin@ysedu.com',
            password: 'password123', // Your User schema likely hashes this automatically
            role: 'admin'
        });

        console.log('✅ Admin account created successfully!');
        console.log('Email: admin@ysedu.com');
        console.log('Password: password123');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();