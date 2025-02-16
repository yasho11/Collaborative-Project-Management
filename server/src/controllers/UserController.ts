import express, { Request, Response } from "express";
import User from "../models/User";

//?----------------------------------------------------------------------------------------------------------------------------------
/*
!@desc: interface defining UserEmail & Role

*/

interface CustomRequest extends Request {
  UserEmail?: string;
  role?: string;
}
//?----------------------------------------------------------------------------------------------------------------------------------

/*
!@name: getAllUsers
!@Access: Private(admin-level)
!@desc: gets all user if your role is admin

*/
export const getAllUsers = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const { role, UserEmail: email } = req;

  if (!role || !email) {
    return res.status(401).json({ error: "Unauthorized request" });
  }

  if (role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Access denied" });
  }

  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching the data", error });
  }
};

//?----------------------------------------------------------------------------------------------------------------------------------

export const getUserById = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const { role, UserEmail: email } = req;
  const { id } = req.params; // ✅ Extract 'id' properly

  if (!role || !email) {
    return res.status(401).json({ error: "Unauthorized request" });
  }

  if (role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Access denied" });
  }

  if (!id) {
    return res.status(400).json({ message: "No ID provided" });
  }

  try {
    // ✅ Ensure 'id' is used correctly as a string
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching the data", error });
  }
};

//?-----------------------------------------------------------------------------------------------
export const DeleteUser = async (
  req: CustomRequest,
  res: Response
): Promise<any> => {
  const { role, UserEmail: email } = req;
  const { id } = req.params; // ✅ Extract 'id' properly
  const user = await User.findById(id);

  if (!role || !email) {
    return res.status(401).json({ error: "Unauthorized request" });
  }

  if (role !== "admin" && user?.Email !== email) {
    return res.status(403).json({ error: "Forbidden: Access denied" });
  }

  try {
    const userDelete = await User.findByIdAndDelete(id);
    res.status(200).json({
      Success: "True",
      Message: `User with id: ${id} has been deleted`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching the data", error });
  }
};
