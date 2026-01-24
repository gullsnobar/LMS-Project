const dotenv = require('dotenv');
const path = require('path');

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const dns = require('dns');

// Set DNS servers to Google's public DNS
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

console.log('Environment loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 30) + '...' : 'NOT FOUND');
console.log('\nAttempting MongoDB connection...\n');

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('MONGO_URI not found in environment variables!');
    process.exit(1);
}

// Connection options
const options = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4,
    maxPoolSize: 10,
};

mongoose.connect(mongoUri, options)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        console.log('Connection state:', mongoose.connection.readyState);
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ MongoDB Connection Failed:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    });
