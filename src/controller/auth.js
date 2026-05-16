import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../modules/user.js";

export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await User.findOne({email});
    if (existUser) {
      return res.status(409).json({
        message: "user alerday exist",
        forword: false,
      });
    }
    const hashpassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashpassword });
    await user.save();
    res.status(201).json({
      message: "User created successfully",
      forword: true,
      data: user,
    });
  } catch (error) {
     res.status(500).json({ message: error.message, success: false });
  }
};

export const Login = async (req, res)=>{

    try {
        const {email, password }= req.body;
        const user = await User.findOne({email});
        if(!user){
             return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch= await bcrypt.compare(password, user.password)
        if(!isMatch){
             return res.status(400).json({ message: "Invalid credentials" });
        }

     const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET,{
        expiresIn: "35h",
     })
      res
      .status(200)
      .json({ message: "Login successful", token, forword: true, data: user });
    } catch (error) {
      res.status(500).json({ message: error.message, success: false });       
        
    }


}
