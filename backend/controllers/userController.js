import React from "react";
import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const Register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All the fields are required",
      });
    }

    const ifalreadyexisting = await User.findOne({ email });
    if (ifalreadyexisting) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some error occured!!",
    });
  }
};

// export const Login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(401).json({
//         message: "Invalid data",
//         success: false,
//       });
//     }
//     const currentuser = await User.findOne({ email });
//     if (!currentuser) {
//       console.log(currentuser);

//       return res.status(401).json({
//         message: "Invalid email or password",
//         success: false,
//       });
//     }

//     const isMatch = bcryptjs.compare(password, currentuser.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         message: "Invalid email or password",
//         success: false,
//       });
//     }
//     // const tokenData = {
//     //  ,
//     // };

//     const token = jwt.sign({ id: currentuser._id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     return res
//       .status(200)
//       .cookie("token", token, { httpOnly: true })
//       .json({
//         message: `Welcome back ${currentuser.fullName}`,
//         currentuser,
//         success: true,
//       });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       success: false,
//     });
//   }
// };

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Both data required",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    const tokenData = {
      id: user._id,
    };
    const token = await jwt.sign(tokenData, "dfbvdkjzfnvkjzdnfvkzdnjf", {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .cookie("token", token)
      .json({
        message: `Welcome back ${user.fullName}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const Logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        expiresIn: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some error occured!!",
    });
  }
};
