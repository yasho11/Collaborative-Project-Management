import express, { Request, Response } from "express";
import Project from "../models/Project";
import Workspace from "../models/Workspace"; // Assuming you have a Workspace model
import { ObjectId } from "mongoose";
import crypto from "crypto";
import mongoose from "mongoose";
//?-------------------------------------------------------------------
/*
!@desc: Interface defining useremail, role, and ID in the request
*/
interface CustomRequest extends Request {
  UserEmail?: string;
  role?: string;
  id?: ObjectId;
}

//?--------------------------------------------------------------------
/*
!@Name: createProject
!@desc: Creates a project inside a workspace
!@access: Private (Only accessible to workspace Admin)
*/
export const createProject = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  console.log("/POST project/hit");
  try {
    const { Name, description, tasks, dueDate } = req.body;
    const createdBy = req.id;
    const { workspaceId } = req.params;
    const userRole = req.role;

    // **1. Validate Required Fields**
    if (!Name || !workspaceId || !createdBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // **2. Verify if Workspace Exists**
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // **3. Check If User is Admin in Workspace**
    const isAdmin = workspace.members.some(
      (member: { userId: ObjectId; role: string }) =>
        member.userId.toString() === createdBy?.toString() &&
        member.role === "Admin"
    );
    if (!isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // **4. Create New Project**
    const newProject = new Project({
      Name: Name,
      Description: description,
      workspaceId,
      createdBy,
      members: [{ userId: createdBy, role: "Admin" }], // Creator is Admin
      tasks: tasks || [],
      createdAt: new Date(),
      dueDate,
      progress: {
        totalTasks: tasks?.length || 0,
        completedTasks: 0,
        completionPercentage: 0,
      },
    });

    // **5. Save Project**
    const savedProject = await newProject.save();
    workspace.projects.push(savedProject._id as ObjectId);
    await workspace.save();

    await workspace.populate("projects");

    return res
      .status(201)
      .json({ message: "Project created successfully", project: savedProject });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//?--------------------------------------------------------------------
/*
!@Name: getAllProjects
!@desc: Get all projects for a user in a workspace
!@access: Private (Only accessible to workspace members)
*/
export const getProjectByPeople = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const id = req.id;
    const workspaceid = req.params.workspaceid; // FIXED: Extract workspaceId correctly

    if (!id) {
      return res.status(401).json({ error: "Unauthorized: Access Denied" });
    }

    // **1. Check if Workspace Exists**
    const workspace = await Workspace.findById(workspaceid);
    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found!" });
    }

    // **2. Verify User Membership in Workspace**
    const isWSMember = workspace.members.some(
      (member) => member.userId.toString() === id.toString()
    );

    if (!isWSMember) {
      return res.status(403).json({
        error: "Access Denied: You are not a member of this workspace.",
      });
    }

    // **3. Retrieve All Projects Where User is a Member**
    const projects = await Project.find({
      workspaceId: workspaceid,
      members: { $elemMatch: { userId: id } },
    });

    return res
      .status(200)
      .json({ message: "Projects retrieved successfully", projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

//?-------------------------------------------------------------------------------------------

/*
!@Name: getProjectById
!@desc: Get specific projects for a user in a workspace
!@access: Private (Only accessible to project members)
*/

export const getProjectById = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const id = req.id;

  const projectId = req.params.projectId;

  if (!id) {
    return res.status(404).json({ error: "UnAuthorized: Access Denied" });
  }

  if (!projectId) {
    return res.status(400).json({ error: "Project Not Found!" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: "Invalid project ID format" });
    }
    const project = await Project.findById(
      new mongoose.Types.ObjectId(projectId)
    );

    if (!project) {
      return res.status(404).json({ error: "Project Not Found!!" });
    }

    const isMember = project.members.some(
      (member) => member.userId.toString() === id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ error: "Only member can veiw" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Project Retrieved",
        project,
      });
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

//?--------------------------------------------------------------------
/*
!@Name: updateProject
!@desc: Update a project inside a workspace
!@access: Private (Only accessible to project Admin)
*/

export const updateProject = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const id = req.id;

  const projectId = req.params.projectId;

  if (!id) {
    return res.status(401).json({ error: "UnAuthorized access" });
  }
  console.log(`Project Id: ${projectId}`);
  try {
    const project = await Project.findById(
      new mongoose.Types.ObjectId(projectId)
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isMember = project.members.some(
      (member) => member.userId.toString() === id.toString()
    );
    const isAdmin = project.members.some(
      (member) => member.role.toString().toLowerCase() === "admin"
    );
    if (isMember && isAdmin) {
      if (req.body.Name) {
        project.Name = req.body.Name;
      }
      if (req.body.description) {
        project.Description = req.body.description;
      }
      if (req.body.dueDate) {
        project.dueDate = req.body.dueDate;
      }

      await project?.save();

      return res.status(201).json({
        success: true,
        message: "Project updated successfully",
        project: project,
      });
    } else {
      return res.status(401).json({ error: "UnAuthorized access" });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

//?--------------------------------------------------------------------
/*
!@Name: deleteProject
!@desc: Delete a project inside a workspace
!@access: Private (Only accessible to project Admin)
*/

export const deleteProject = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const userId = req.id;
  const id = req.params.id;

  if (!userId) {
    return res.status(401).json({ error: "UnAuthorized access" });
  }
  console.log(`userId: ${userId}`);
  try {
    const project = await Project.findById(new mongoose.Types.ObjectId(id));

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const isMember = project.members.some(
      (member) => member.userId.toString() === userId.toString()
    );
    const isAdmin = project.members.some(
      (member) => member.role.toString().toLowerCase() === "admin"
    );
    if (!isAdmin) {
      return res
        .status(401)
        .json({ message: "UnAuthorizeed access: NOt a admin" });
    }
    if (!isMember) {
      return res
        .status(401)
        .json({ message: "UnAuthorizeed access: NOt a member" });
    }
    if (isAdmin && isMember) {
      const deleleProject = await Project.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        Message: "Project successfully deleted",
        workspace: deleleProject,
      });
    } else {
      return res
        .status(401)
        .json({ message: "UnAuthorizeed access: NOt a member or a admin" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

//?--------------------------------------------------------------------
/*
!@Name: addMemberToProject(req, res)
!@desc: Adding member to project
!@access: Private (Only accessible to project Admin)
*/

export const addMemberToProject = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.body;
    const userId = req.id;
    const { addId } = req.body;
    const project = await Project.findOne({ "invites.token": token });
    console.log(`Invitation token: ${token}`);
    if (!project) {
      return res.status(400).json({ message: "Invalid invite token" });
    }

    const invite = await project.invites.find((inv) => inv.token === token);

    if (!invite || new Date(invite.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Invite expired or invalid" });
    }

    project.invites = project.invites.filter((inv) => inv.token !== token);

    if (addId) {
      const newMember = {
        userId: addId,
        role: "Member",
      };
      project.members.push(newMember);
    } else {
      return res.status(400).json({ message: "User Id is undefined" });
    }
    await project.save();

    return res.status(200).json({ message: "Successfully joined the project" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Internal server error", err: error.message });
  }
};

//?-------------------------------------------------------------------------------------

/*
!@Name:inviteMember
!@desc: Generating and Storing the Invite Token  
!@access: private(admin member of the workspace)
*/

export const inviteMember = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { email, projectId } = req.body;

    //Generate a secure token

    const token = crypto.randomBytes(32).toString("hex");

    //Save the invite in the database

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.invites.push({ email, token, expiresAt });
    await project.save();

    return res
      .status(200)
      .json({ message: "Invitaiton sent successfully", token });
  } catch (error) {
    return res.status(500).json({ message: "Error sending invitation", error });
  }
};

//?-------------------------------------------------------------------------------------

/*
!@Name:removeMember
!@desc: Removing members from the project
!@access: private(admin member of the project)
*/

export const removeMember = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const { _id } = req.params; // Project ID
    const userId = req.id; // Current User ID
    const { DeleteId } = req.body; // User ID to be removed

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    // Fetch the project
    const project = await Project.findById(_id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Ensure the requester is an admin
    const isAdmin = project.members.some(
      (member) =>
        member.userId.toString() === userId.toString() &&
        member.role === "Admin"
    );

    if (!isAdmin) {
      return res.status(403).json({ error: "Only admins can remove members" });
    }

    // Ensure the member exists
    const memberToRemove = project.members.find(
      (member) => member.userId.toString() === DeleteId.toString()
    );

    if (!memberToRemove) {
      return res.status(404).json({ error: "Member not found in project" });
    }

    // Prevent removing the last admin
    const totalAdmins = project.members.filter(
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

    // Convert DeleteId to ObjectId and remove the member properly
    project.members = project.members.filter(
      (member) => member.userId.toString() !== DeleteId.toString()
    );

    await project.save();

    return res.status(200).json({ message: "Member removed successfully" });
  } catch (error: any) {
    console.error("Error removing member:", error);
    return res
      .status(500)
      .json({ error: "Error removing member", details: error.message });
  }
};

//?-------------------------------------------------------------------------------------

/*
!@Name:makeAdmin
!@desc: Adding another admin 
!@access: private(admin member of the project)
*/
// Make a member an admin within the project
export const makeAdmin = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const { _id } = req.params; // project ID
  const userId = req.id; // Requesting User (should be an admin)
  const { memberId } = req.body; // Member to be promoted to admin

  if (!userId || !memberId) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    const project = await Project.findById(_id);

    if (!project) {
      return res.status(404).json({ error: "project not found" });
    }

    // Check if the requesting user is an admin
    const isAdmin = project.members.some(
      (member) =>
        member.userId.toString() === userId.toString() &&
        member.role === "Admin"
    );

    if (!isAdmin) {
      return res.status(403).json({ error: "Only admins can promote members" });
    }

    // Find the member to be promoted
    const member = project.members.find(
      (member) => member.userId.toString() === memberId.toString()
    );

    if (!member) {
      return res.status(404).json({ error: "Member not found in project" });
    }

    // If the member is already an admin, return a message
    if (member.role === "Admin") {
      return res.status(400).json({ error: "Member is already an admin" });
    }

    // Update the member's role to admin
    member.role = "Admin";
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Member successfully promoted to admin",
      project,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error promoting member", details: error });
  }
};
