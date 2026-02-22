import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/easy-search';

let isConnected = false;

export const connectToDatabase = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('Using existing database connection');
        return mongoose.connection;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('Database connected successfully');
        return db.connection;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};
