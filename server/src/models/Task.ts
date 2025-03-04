import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  projectId: mongoose.Types.ObjectId;

  status: string;
  priority: string;
  createdAt: Date;
  dueDate: Date;
  createdBy: mongoose.Types.ObjectId;
  activityLog: {
    userId: mongoose.Schema.Types.ObjectId;
    action: string;
    timestamp: Date;
  }[];
  comments: {
    _id: mongoose.Types.ObjectId;
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
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
