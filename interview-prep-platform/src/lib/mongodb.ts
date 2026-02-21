import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Extend global to cache mongoose connection across hot-reloads
declare global {
    // eslint-disable-next-line no-var
    var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                bufferCommands: false,
                serverSelectionTimeoutMS: 10_000, // give up after 10 s instead of hanging
                connectTimeoutMS: 10_000,
            })
            .catch((err) => {
                // Reset so the next request can try again instead of
                // re-throwing the same cached rejection forever.
                cached.promise = null;
                cached.conn = null;
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
