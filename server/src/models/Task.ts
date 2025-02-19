import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  projectId: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  status: string;
  priority: string;
  createdAt: Date;
  dueDate: Date;
  activityLog: {
    userId: mongoose.Schema.Types.ObjectId;
    action: string;
    timestamp: Date;
  };
  comments: {
    userId: mongoose.Schema.Types.ObjectId;
    message: string;
    status: string;
  }[];
}

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    projectId: {
      type: mongoose.Types.ObjectId,
      ref: "Project", // Reference to the Project model
      required: true,
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    activityLog: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model
        },
        action: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model
        },
        message: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["Pending", "Resolved"],
          default: "Pending",
        },
      },
    ],
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
