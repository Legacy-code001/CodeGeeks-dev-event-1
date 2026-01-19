import mongoose, { type Mongoose } from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  // Fail fast during build/startup if the environment is misconfigured.
  throw new Error("MONGODB_URI environment variable is not defined")
}

type MongooseCache = {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

// In development, Next.js can reload modules on file changes.
// Storing the connection in a global prevents creating many connections.
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export default async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    // Create the connection promise once and reuse it for concurrent calls.
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose)
  }

  cached.conn = await cached.promise
  return cached.conn
}
