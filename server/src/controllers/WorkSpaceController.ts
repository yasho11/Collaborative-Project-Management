import Workspace from "../models/Workspace";
import express, { Request, Response } from "express";
import User from "../models/User";
import { ObjectId } from "mongoose";
import crypto from "crypto";
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
      invites: [], //Empty Invites initially
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

/*
!@name:getworkspaceById
!@desc: fetches all workspace
!@access: private(memeber user)
*/
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

//?-------------------------------------------------------------------------------------------
/*
!@name:updateWorkspace
!@desc: Updates Workspace information  
!@access: private(admin member of the workspace)
*/

export const updateWorkspace = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const { _id } = req.params;
  const userEmail = req.UserEmail;
  const userId = req.id;

  if (!userEmail || !userId) {
    return res.status(401).json({ error: "Unauthorized Access" });
  }
  console.log(_id);

  try {
    const workspace = await Workspace.findById(_id);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (member) => member.userId.toString() === userId.toString()
    );
    const isAdmin = workspace.members.some(
      (member) => member.role.toString() === "Admin"
    );

    if (isMember && isAdmin) {
      if (req.body.workspaceName) {
        workspace.name = req.body.workspaceName;
      }
      if (req.body.workspaceDesc) {
        workspace.description = req.body.workspaceDesc;
      }
      await workspace?.save();
      return res.status(201).json({
        success: true,
        message: "Workspace updated successfully",
        workspace: workspace,
      });
    } else {
      return res.status(401).json({ message: "UnAuthorizeed access" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

//?-------------------------------------------------------------------------------------

/*
!@name:deleteWorkspace
!@desc: Delete Workspace   
!@access: private(admin member of the workspace)
*/

export const deleteWorkspace = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const { _id } = req.params;
  const userEmail = req.UserEmail;
  const userId = req.id;

  if (!userEmail || !userId) {
    return res.status(401).json({ error: "Unauthorized Access" });
  }
  console.log(_id);

  try {
    const workspace = await Workspace.findById(_id);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (member) => member.userId.toString() === userId.toString()
    );

    const isAdmin = workspace.members.some(
      (member) => member.role.toString() === "Admin"
    );

    if (isAdmin && isMember) {
      const deleteWorkspace = await Workspace.findByIdAndDelete(_id);

      return res.status(200).json({
        success: true,
        Message: "Worspace successfully deleted",
        workspace: deleteWorkspace,
      });
    } else {
      return res.status(401).json({ message: "UnAuthorizeed access" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

//?-------------------------------------------------------------------------------------

/*
!@name:inviteMember
!@desc: Generating and Storing the Invite Token  
!@access: private(admin member of the workspace)
*/

export const inviteMember = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { email, workspaceId } = req.body;

    //Generate a secure token

    const token = crypto.randomBytes(32).toString("hex");

    //Save the invite in the database

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    workspace.invites.push({ email, token, expiresAt });
    await workspace.save();

    return res
      .status(200)
      .json({ message: "Invitaiton sent successfully", token });
  } catch (error) {
    return res.status(500).json({ message: "Error sending invitation", error });
  }
};

//?-------------------------------------------------------------------------------------

/*
!@name:addMember
!@desc: Validating the Token and Adding the User  
!@access: private(user)
*/

export const addMember = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.body;
    const userId = req.id; // Current user's ID, which will be used for validation
    const workspace = await Workspace.findOne({ "invites.token": token });

    // Check if the workspace is found
    if (!workspace) {
      return res.status(400).json({ message: "Invalid invite token" });
    }

    // Find the invite with the provided token
    const invite = workspace.invites.find((inv) => inv.token === token);

    // Validate the invite
    if (!invite || new Date(invite.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Invite expired or invalid" });
    }

    // Remove the used invite token
    workspace.invites = workspace.invites.filter((inv) => inv.token !== token);

    // Add the member to the workspace members array with a default role of 'Member'
    if (userId) {
      const newMember = {
        userId: userId,
        role: "Member",
      };
      workspace.members.push(newMember);
    } else {
      return res.status(400).json({ message: "User ID is undefined" });
    }

    // Save the workspace with the updated members array
    await workspace.save();

    return res
      .status(200)
      .json({ message: "Successfully joined the workspace" });
  } catch (error) {
    return res.status(500).json({ message: "Error joining workspace", error });
  }
};

//?-------------------------------------------------------------------------------------

/*
!@name:removeMember
!@desc: Removing members from the workspace
!@access: private(admin member of the workspace)
*/
export const removeMember = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const { _id } = req.params; // Workspace ID
  const userEmail = req.UserEmail;
  const userId = req.id; // Current User ID
  const { DeleteId } = req.params; // User ID to be removed
  console.log(userId);
  if (!userEmail || !userId) {
    return res.status(401).json({ error: "Unauthorized Access" });
  }

  try {
    // Fetch the workspace
    const workspace = await Workspace.findById(_id);
    console.log(workspace);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // Check if the requester is an admin
    const isAdmin = workspace.members.some(
      (member) =>
        member.userId.toString() === userId.toString() &&
        member.role === "Admin"
    );

    if (!isAdmin) {
      return res.status(403).json({ error: "Only admins can remove members" });
    }

    // Check if the member exists
    const memberToRemove = workspace.members.find(
      (member) => member.userId.toString() === DeleteId.toString()
    );

    if (!memberToRemove) {
      return res.status(404).json({ error: "Member not found in workspace" });
    }

    // Prevent the last admin from removing themselves
    const totalAdmins = workspace.members.filter(
      (member) => member.role === "Admin"
    ).length;

    if (
      memberToRemove.userId.toString() === userId.toString() &&
      totalAdmins === 1
    ) {
      return res
        .status(400)
        .json({ error: "Cannot remove yourself as the last admin" });
    }

    // Remove the member
    await Workspace.updateOne(
      { _id },
      { $pull: { members: { userId: DeleteId } } }
    );

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error removing member", details: error });
  }
};

//?-------------------------------------------------------------------------------------

/*
!@name:makeAdmin
!@desc: Adding another admin 
!@access: private(admin member of the workspace)
*/
// Make a member an admin within the workspace
export const makeAdmin = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const { _id } = req.params; // Workspace ID
  const userId = req.id; // Requesting User (should be an admin)
  const { memberId } = req.body; // Member to be promoted to admin

  if (!userId || !memberId) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    console.log(`Workspace Id: ${_id}`);
    const workspace = await Workspace.findById(_id);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    // Check if the requesting user is an admin
    const isAdmin = workspace.members.some(
      (member) =>
        member.userId.toString() === userId.toString() &&
        member.role === "Admin"
    );

    if (!isAdmin) {
      return res.status(403).json({ error: "Only admins can promote members" });
    }

    // Find the member to be promoted
    const member = workspace.members.find(
      (member) => member.userId.toString() === memberId.toString()
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found in workspace" });
    }

    // If the member is already an admin, return a message
    if (member.role === "Admin") {
      return res.status(400).json({ error: "Member is already an admin" });
    }

    // Update the member's role to admin
    member.role = "Admin";
    await workspace.save();

    return res.status(200).json({
      success: true,
      message: "Member successfully promoted to admin",
      workspace,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error promoting member", details: error });
  }
};
