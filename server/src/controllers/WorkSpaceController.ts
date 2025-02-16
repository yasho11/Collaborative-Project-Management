import Workspace from "../models/Workspace";
import express, { Request, Response } from "express";
import User from "../models/User";
import { ObjectId } from "mongoose";
//?----------------------------------------------------------------------------------------------
/*
!@desc: interface to define UserEmail!
 */

interface CustomRequest extends Request {
  UserEmail?: string;
  id?: ObjectId;
}

//?----------------------------------------------------------------------------------------------

/*
!@name: createWorkspace
!@desc: this will create a workspace
!@access: Private(Users all)
*/

export const createWorkspace = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { name, description } = req.body;
    const UserEmail = req.UserEmail;
    console.log(UserEmail);

    // Ensure email exists in request
    if (!UserEmail) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // Find user by email
    const user = await User.findOne({ Email: UserEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = user._id; // Extract user ID

    if (!name) {
      return res.status(400).json({ error: "Workspace name is required" });
    }

    // Create new workspace
    const newWorkspace = new Workspace({
      name,
      description,
      createdBy: userId,
      members: [{ userId: userId, role: "Admin" }], // Auto-add creator as Admin
      projects: [], // Empty projects initially
    });

    // Save the workspace
    await newWorkspace.save();

    // Add the new workspace ID to the user's workspaceList
    user.workspaceList.push(newWorkspace._id as any); // Add the workspace ID to the user's workspaceList
    await user.save(); // Save the updated user

    // Populate workspaceList to get full workspace data
    const userWithWorkspaces = await User.findOne({
      Email: UserEmail,
    }).populate("workspaceList");

    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      workspace: newWorkspace,
      user: userWithWorkspaces, // Returning updated user with populated workspace list
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

//?-------------------------------------------------------------------------------------------
/*
!@name:getallworkspace
!@desc: fetches all workspace
!@access: private(all user)
*/
export const getAllWorkspace = async (req: CustomRequest, res: Response) => {
  const userEmail = req.UserEmail;

  if (!userEmail) {
    res.status(401).json({ error: "UnAuthorized Access" });
  }

  try {
    const workspaces = await Workspace.find();
    res.status(200).json({ Success: "True", Message: workspaces });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

//?-------------------------------------------------------------------------------------------
export const getWorkspaceById = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const { _id } = req.params;
  const userEmail = req.UserEmail;
  const userId = req.id; // Assuming you are getting the user ID here

  if (!userEmail || !userId) {
    return res.status(401).json({ error: "Unauthorized Access" });
  }
  console.log(_id);
  try {
    const workspace = await Workspace.findById(_id);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // Check if the user is a member of the workspace
    const isMember = workspace.members.some(
      (member) => member.userId.toString() === userId.toString()
    );

    if (isMember) {
      return res.status(200).json({
        success: true,
        message: "Workspace Retrieved",
        workspace,
      });
    } else {
      return res
        .status(403)
        .json({ error: "You are not a member of this workspace" });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};
