import mongoose, { Document, Schema } from "mongoose";

export interface IUsers extends Document {
  Name: string;
  Email: string;
  Password: string;
  Role: string;
  workspaceList: [];
  ProfileUrl: string;
}

const UserSchema: Schema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Role: {
      type: String,
      required: true,
    },
    workspaceList: {
      type: [String],
      required: false,
      defualt: [],
    },
    ProfileUrl: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUsers>("Users", UserSchema);
