import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../lib/mongodb";
import Issue from "../../../../../models/Issue";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    const issue = await Issue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    if (ip !== "unknown" && issue.upvotedByIPs && issue.upvotedByIPs.includes(ip)) {
      return NextResponse.json({ error: "Already upvoted" }, { status: 400 });
    }

    issue.votes += 1;
    if (ip !== "unknown") {
      if (!issue.upvotedByIPs) issue.upvotedByIPs = [];
      issue.upvotedByIPs.push(ip);
    }
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
