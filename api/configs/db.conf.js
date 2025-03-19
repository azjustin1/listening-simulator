const mongoose = require('mongoose');

// Connect to MongoDB
async function connect() {
    try {
        const uri = 'mongodb://localhost:27017/quizzes';
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

module.exports = connect;
