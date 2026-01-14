const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'test@example.com';
        const password = '123456'; // Plain text as per current implementation

        let user = await User.findOne({ email });

        if (user) {
            console.log('User already exists. Updating password...');
            user.password = password;
            await user.save();
            console.log('User updated:', user);
        } else {
            user = await User.create({
                name: 'Test User',
                email,
                password,
                isAdmin: false
            });
            console.log('User created:', user);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUser();
