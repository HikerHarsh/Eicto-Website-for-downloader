import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Stats from '../../../models/Stats';

export async function GET() {
  try {
    await dbConnect();
    
    // Find the single stats document or create it if it doesn't exist
    let stats = await Stats.findOne({});
    if (!stats) {
      stats = await Stats.create({});
    }

    return NextResponse.json({ totalDownloads: stats.totalDownloads });
  } catch (error) {
    console.error("Error in GET /api/downloads:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    await dbConnect();

    // Find and update the totalDownloads by incrementing by 1
    // If it doesn't exist, upsert it with the default starting value + 1
    const stats = await Stats.findOneAndUpdate(
      {},
      { $inc: { totalDownloads: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ totalDownloads: stats.totalDownloads });
  } catch (error) {
    console.error("Error in POST /api/downloads:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
