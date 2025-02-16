import User from "../models/User";
import express, { Response, Request } from "express";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

//?-----------------------------------------------------
dotenv.config();
//TEMP CONST:
const JWT_SECRET = process.env.JWT_SECRET;
console.log(JWT_SECRET);
//?-------------------------------------------------------
/*
!@desc: interface defining useremail

*/
interface CustomRequest extends Request {
  UserEmail?: string;
}

//?--------------------------------------------------------
/* 
!@name: Storage 
!@desc: function to store image
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
    res.status(400).json({ message: "Please fill all the required fields" });
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
          if (JWT_SECRET) {
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
          } else {
            res.status(400).json({ message: "Cannot find the secret key" });
          }
        }
      }
    } catch (err: any) {
      res.status(500).json({ error: "Server error", err });
    }
  }
};

//?------------------------------------------------------------------------------------------------------------
/*
!@name: getCurrentUser
!@desc: to get profile
!@access: private
*/

export const getCurrentUser = async (req: CustomRequest, res: Response) => {
  const UserEmail = req.UserEmail;

  if (!UserEmail) {
    res.status(404).json({ message: "Token Not decoded" });
  } else {
    try {
      const user = await User.findOne({ Email: UserEmail });
      if (!user) {
        res.status(400).json({ message: "User Not found" });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal error" });
    }
  }
};
//?------------------------------------------------------------------------------------------

/*
!@name: Update profile
!@desc: this function update profile
!@access: private
*/

export const UpdateProfile = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findOne({ Email: req.UserEmail });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      if (req.body.UpUserName) {
        user.Name = req.body.UpUserName;
      }
      if (req.body.role) {
        user.Role = req.body.role;
      }
      if (req.body.UpUserPassword) {
        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(req.body.UpUserPassword, salt);
      }
      if (req.file) {
        const ProfileURL = req.file ? `/uploads/${req.file.filename}` : null;
        if (ProfileURL) {
          user.ProfileUrl = ProfileURL;
        }
      }
    }

    await user?.save();
    res
      .status(201)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (err: any) {
    console.error("Update error: ", err);
    res.status(500).json({ message: "Server Error" });
  }
};
