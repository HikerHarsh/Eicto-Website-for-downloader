import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import Issue from "../../../../../models/Issue";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { text, author } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const issue = await Issue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const newComment = {
      text,
      author: author || "Anonymous",
      createdAt: new Date(),
    };

    issue.comments.push(newComment as any);
    await issue.save();

    return NextResponse.json({ success: true, comment: newComment });
  } catch (error) {
    console.error("Failed to add comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
