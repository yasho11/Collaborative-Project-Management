import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  Name: string;
  Description: string;
  workspaceId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  members: { userId: mongoose.Schema.Types.ObjectId; role: string }[];
  tasks: mongoose.Types.ObjectId[];
  createdAt: Date;
  dueDate: Date;
  progress: {
    totalTasks: number;
    completedTasks: number;
    completionPercentage: number;
  };
  invites: { email: string; token: string; expiresAt: Date }[]; // Invite System
}

const ProjectSchema: Schema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
  workspaceId: {
    type: mongoose.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
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
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
  progress: {
    totalTasks: {
      type: Number,
      required: true,
    },
    completedTasks: {
      type: Number,
      required: true,
    },
    completionPercentage: {
      type: Number,
      required: true,
    },
  },
  invites: [
    {
      email: { type: String, required: true },
      token: { type: String, required: true },
      expiresAt: { type: Date, required: true },
    },
  ],
});

export default mongoose.model<IProject>("Project", ProjectSchema);
