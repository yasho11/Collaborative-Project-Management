import Task from "../models/Task";
import mongoose, { Mongoose, ObjectId } from "mongoose";
import User from "../models/User";
import { Request, Response } from "express";
import Project from "../models/Project";

//?----------------------------------------------------------------------------------------------
/*
!@desc: interface to define UserEmail!
 */

interface CustomRequest extends Request {
  UserEmail?: string;
  id?: ObjectId;
}

//?-------------------------------------------------------------------------

/*
!@name: createTask
!@desc: this will create a task
!@access: Private(all users included in the project)
*/
export const createTask = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const email = req.UserEmail;
    const userId = req.id; // The ID of the user making the request

    if (!email || !userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const { title, description, projectId, status, priority, dueDate } =
      req.body;

    // Validate required fields
    if (!title || !projectId) {
      return res.status(400).json({ error: "Title, projectId are required" });
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      projectId,
      status: status || "Not Started",
      priority: priority || "Medium",
      dueDate,
      createdBy: userId,
      activityLog: [
        {
          userId: userId,
          action: "Task created",
          timestamp: new Date(),
        },
      ],
    });

    // Save the task
    await newTask.save();

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//?-------------------------------------------------------------------------

/*
!@name: getAllTasks
!@desc: this will get all task for a user
!@access: Private(all users included in the task)
*/
export const getAllTasks = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.id;
    const { projectId } = req.params;
    console.log(`Project ID: ${projectId}`);

    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Convert projectId to ObjectId
    const projectObjectId = new mongoose.Types.ObjectId(projectId);

    const tasks = await Task.find({ projectId: projectObjectId })
      .populate("projectId", "title")
      .populate("createdBy", "name");
    console.log(tasks);
    res.status(200).json(tasks.length > 0 ? tasks : []);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error, unable to fetch tasks" });
  }
};

//?-------------------------------------------------------------------------

/*
!@name: getTaskById
!@desc: this will get a specific task
!@access: Private(all users included in the task)
*/

export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params; // Assuming taskId is passed as a parameter in the route
    if (!taskId) {
      res.status(400).json({ message: "Invalid task ID" });
      return;
    }

    // Fetch the task by its ID
    const task = await Task.findById(taskId)
      .populate("projectId", "title") // Populating projectId with project title
      .populate("createdBy", "name"); // Populating createdBy with user name

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, unable to fetch task" });
  }
};

//?-------------------------------------------------------------------------

/*
!@name: updateTask
!@desc: Update Taks details
!@access: Private(all users included in the task)
*/

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params; // Assuming taskId is passed as a parameter in the route
    const { status, dueDate, priority, description } = req.body; // Extract fields to update

    if (!taskId) {
      res.status(400).json({ message: "Invalid task ID" });
      return;
    }

    // Create an object with updated fields
    const updateFields: { [key: string]: any } = {};

    if (status) updateFields.status = status;
    if (dueDate) updateFields.dueDate = new Date(dueDate); // Ensure it's in Date format
    if (priority) updateFields.priority = priority;
    if (description) updateFields.description = description;

    // Find the task by ID and update it
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, {
      new: true, // Return the updated task
      runValidators: true, // Ensure validators are run for the updated fields
    })
      .populate("projectId", "title") // Populating projectId with project title
      .populate("createdBy", "name"); // Populating createdBy with user name

    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json(updatedTask);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      message: "Server error, unable to update task",
      error: err.message,
    });
  }
};

//?-------------------------------------------------------------------------

/*
!@name: DeleteTask
!@desc: Delete Task details
!@access: Private(all users included in the task)
*/
export const deleteTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { taskId } = req.params; // Assuming taskId is passed as a parameter in the route

    if (!taskId) {
      res.status(400).json({ message: "Invalid task ID" });
      return;
    }

    // Find the task by ID and delete it
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Task deleted successfully", taskId: taskId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, unable to delete task" });
  }
};

//?-------------------------------------------------------------------------

/*
!@name: assignTask
!@desc: Assign a Task to a user
!@access: Private(all users included in the task)
*/

export const assignTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params; // Assuming taskId is passed as a parameter in the route
    const { userId, projectId } = req.body; // Extract the userId and projectId from the request body

    if (
      !mongoose.Types.ObjectId.isValid(taskId) ||
      !mongoose.Types.ObjectId.isValid(projectId)
    ) {
      res.status(400).json({ message: "Invalid task ID or project ID" });
      return;
    }

    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }

    // Check if the user is part of the project
    const userIsMember = project.members.some(
      (member) => member.userId.toString() === userId
    );

    if (!userIsMember) {
      res.status(403).json({ message: "User is not part of this project" });
      return;
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, {
      new: true,
      runValidators: true,
    }).populate("projectId", "Name"); // Populate project name

    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Task successfully assigned", task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, unable to assign task" });
  }
};

//?-------------------------------------------------------------------------

/*
!@name: addComment
!@desc: Add a comment to the task
!@access: Private(all users included in the task)
*/

export const addComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params; // Assuming taskId is passed as a parameter in the route
    const { userId, message, status = "Pending" } = req.body; // Extract userId, message, and status from request body

    if (!taskId) {
      res.status(400).json({ message: "Invalid task ID" });
      return;
    }

    // Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    // Add the comment to the task's comments array
    task.comments.push({
      _id: new mongoose.Types.ObjectId(),
      userId,
      message,
      status,
    });

    // Save the updated task
    const updatedTask = await task.save();

    // Optionally, log the comment action in the activity log
    task.activityLog.push({
      userId,
      action: "Added comment",
      timestamp: new Date(),
    });

    await task.save();

    res.status(200).json({
      message: "Comment added successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, unable to add comment" });
  }
};

//?-------------------------------------------------------------------------

/*
!@name: updateComment
!@desc: Update a comment status to the task
!@access: Private(all users included in the task)
*/
export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { commentId } = req.params; // Get commentId from the URL
    const { message, status } = req.body; // Get updated message and status

    // Check if taskId is valid
    if (!taskId) {
      res.status(400).json({ message: "Invalid task ID" });
      return;
    }

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Find the comment by comparing ObjectId correctly
    const comment = task.comments.find(
      (comment) => comment._id.toString() === commentId // Ensure you are comparing ObjectId to string
    );

    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    // Update the comment
    comment.message = message || comment.message;
    comment.status = status || comment.status;

    await task.save();

    res.status(200).json({
      message: "Comment updated successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, unable to update comment" });
  }
};

//?-------------------------------------------------------------------------

/*
!@name: DeleteComment
!@desc: Delete a comment 
!@access: Private(all users included in the task)
*/
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { commentId } = req.params; // Get commentId from the URL

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    task.comments = task.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await task.save();

    res.status(200).json({
      message: "Comment deleted successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error, unable to delete comment" });
  }
};
