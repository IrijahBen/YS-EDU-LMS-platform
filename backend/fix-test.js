// fix-test.js
const mongoose = require('mongoose');
require('dotenv').config(); // Assuming you use dotenv for your Mongo URI

// Adjust this path if your Course model is in a different folder
const Course = require('./src/models/Course');

const checkAndFixTest = async () => {
    try {
        // Connect to your database
        const mongoURI = process.env.MONGO_URI || 'mongodb+srv://abayomiajiboye46111_db_user:VkE9cosJ50GTK0FM@cluster0.tio2y6n.mongodb.net/?appName=Cluster0';
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to Database');

        // The exact ID from your error log
        const testId = '6a05fa159a03dea2912b4d21';
        const testDoc = await Course.findById(testId);

        if (!testDoc) {
            console.log('❌ Error: Could not find a course/test with that ID.');
            process.exit(1);
        }

        console.log(`\n📄 Document Found: ${testDoc.title}`);
        console.log(`🏷️  Current Type: ${testDoc.type}`);
        console.log(`📂 Current Sections: ${testDoc.sections.length}`);

        // 1. Force Node to see it as a test
        if (testDoc.type !== 'test') {
            testDoc.type = 'test';
            console.log('🔧 Updated document type to "test"');
        }

        // 2. Forcefully add a section if it has 0
        if (testDoc.sections.length === 0) {
            console.log('⏳ Adding a default Question Bank section...');
            testDoc.sections.push({
                title: 'Question Bank',
                description: 'Main section for exam questions',
                order: 0,
                lessons: [] // This is where questions will go
            });

            await testDoc.save();
            console.log('✅ Section added successfully!');
        } else {
            console.log('✅ It already has sections. No changes needed.');
        }

    } catch (error) {
        console.error('❌ Script crashed:', error.message);
    } finally {
        process.exit(0);
    }
};

checkAndFixTest();