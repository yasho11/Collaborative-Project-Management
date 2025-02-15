import User from "../models/User";
import express, { Response, Request } from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";

//TEMP CONST:
const JWT_SECRET = "SECRET1234";
/* 
@name: Storage 
@desc: function to store image
*/

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "public/uploads");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

//-----------------------------------------------------------------------------------------------

/* 
!@name: register
!@access: public
!@desc:Controller to register user
*/
export const register = async (req: Request, res: Response) => {
  console.log(req.body);
  console.log(req.file);
  const { Name, Email, Password } = req.body;
  const ProfileURL = req.file ? `/uploads/${req.file.filename}` : null;
  const workspaceList: [] = [];
  const Role = "Member";
  if (!Name || !Email || !Password) {
  } else {
    try {
      if (await User.findOne({ Email })) {
        res.status(400).json({ message: "Email already taken!" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(Password, salt);

        const user = new User({
          Name,
          Email,
          Password: passwordHash,
          Role,
          ProfileURL,
          workspaceList,
        });

        await user.save();
        res.status(201).json({ message: "User created successfully!!" });
      }
    } catch (err: any) {
      res.status(500).json({ error: "Server error", err });
    }
  }
};

//?--------------------------------------------------------------------------------------------------------
/* 
!@name: login
!@access: public
!@desc:Controller to log user in
*/

export const login = async (req: Request, res: Response) => {
  const { Email, Password } = req.body;

  if (!Email || !Password) {
    return res
      .status(400)
      .json({ message: "Please fill all the required fields" });
  } else {
    try {
      const user = await User.findOne({ Email });
      if (!user) {
        res
          .status(400)
          .json({ message: "User Not Found! Please register first" });
      } else {
        const isMatched = await bcrypt.compare(Password, user.Password);
        if (!isMatched) {
          res.status(400).json({ message: "Invalid Credentials" });
        } else {
          const token = jwt.sign(
            { id: user._id, email: user.Email, role: user.Role },
            JWT_SECRET,
            { expiresIn: "1d" }
          );
          res.status(200).json({
            message: "Log In Successful",
            token,
            user: {
              id: user._id,
              Name: user.Name,
              Email: user.Email,
              Profile: user.ProfileUrl,
            },
          });
        }
      }
    } catch (err: any) {
      res.status(500).json({ error: "Server error", err });
    }
  }
};

export const getCurrentUser = () => {};
export const UpdateProfile = () => {};
