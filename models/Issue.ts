import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment {
  text: string;
  author: string;
  createdAt: Date;
}

export interface IIssue extends Document {
  title: string;
  description: string;
  author: string;
  votes: number;
  status: "Open" | "In Progress" | "Resolved";
  comments: IComment[];
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  createdAt: { type: Date, default: Date.now },
});

const IssueSchema = new Schema<IIssue>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, default: "Anonymous" },
    votes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    comments: [CommentSchema],
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "issues" }
);

const Issue: Model<IIssue> =
  mongoose.models.Issue || mongoose.model<IIssue>("Issue", IssueSchema);

export default Issue;
