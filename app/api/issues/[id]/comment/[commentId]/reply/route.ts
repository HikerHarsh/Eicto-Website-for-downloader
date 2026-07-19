import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../../../lib/mongodb";
import Issue from "../../../../../../../models/Issue";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const { id, commentId } = await params;
    const body = await request.json();
    const { text, author } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Reply text is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const issue = await Issue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const comment = issue.comments.id(commentId);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const newReply = {
      text,
      author: author || "Anonymous",
      createdAt: new Date(),
    };

    if (!comment.replies) {
      comment.replies = [];
    }
    
    comment.replies.push(newReply as any);
    await issue.save();

    return NextResponse.json({ success: true, reply: newReply });
  } catch (error) {
    console.error("Failed to add reply:", error);
    return NextResponse.json(
      { error: "Failed to add reply" },
      { status: 500 }
    );
  }
}
