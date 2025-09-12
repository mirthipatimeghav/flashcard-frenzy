// src/app/api/mongo-test/route.ts
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;

export async function GET() {
  if (!uri) {
    return NextResponse.json(
      { error: 'MONGODB_URI environment variable is not set.' },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    return NextResponse.json({ message: "Success! Connected to MongoDB." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB.', details: (error as Error).message },
      { status: 500 }
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}