import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/mongodb";
import Issue from "../../../models/Issue";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch all issues sorted by votes (descending) and then by date (newest first)
    const issues = await Issue.find({}).sort({ votes: -1, createdAt: -1 });
    return NextResponse.json(issues);
  } catch (error) {
    console.error("Failed to fetch issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, author } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newIssue = await Issue.create({
      title,
      description,
      author: author || "Anonymous",
      votes: 0,
      status: "Open",
      comments: [],
    });

    return NextResponse.json(newIssue, { status: 201 });
  } catch (error) {
    console.error("Failed to create issue:", error);
    return NextResponse.json(
      { error: "Failed to create issue" },
      { status: 500 }
    );
  }
}
