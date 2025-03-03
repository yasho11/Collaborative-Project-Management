import mongoose, { Document, Schema } from "mongoose";

export interface IWorkspace extends Document {
  Name: string;
  description?: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  members: { userId: mongoose.Schema.Types.ObjectId; role: string }[];
  projects: mongoose.Schema.Types.ObjectId[];
  invites: { email: string; token: string; expiresAt: Date }[]; // Invite System
}

const workspaceSchema: Schema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["Admin", "Member"],
          required: true,
        },
      },
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    invites: [
      {
        email: { type: String, required: true },
        token: { type: String, required: true },
        expiresAt: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IWorkspace>("Workspace", workspaceSchema);
