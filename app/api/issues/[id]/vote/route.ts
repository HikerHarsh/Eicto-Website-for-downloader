import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Issue from "@/models/Issue";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectToDatabase();

    const issue = await Issue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    issue.votes += 1;
    await issue.save();

    return NextResponse.json({ success: true, votes: issue.votes });
  } catch (error) {
    console.error("Failed to upvote issue:", error);
    return NextResponse.json(
      { error: "Failed to upvote issue" },
      { status: 500 }
    );
  }
}
