const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const user = await User.findOne({ email: 'test@example.com' });
        if (user) {
            console.log('User found:', user);
        } else {
            console.log('User NOT found');
        }

        // List all users just in case
        const users = await User.find({});
        console.log('All users:', users);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
