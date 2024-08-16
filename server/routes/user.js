import express from "express";
import bcrypt from "bcrypt";
import { User } from "../Models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ message: "user already existe" });
  }

  const hashpassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashpassword,
  });

  await newUser.save();
  return res.json({ status: true, message: "record registered" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // check for email is correct or not
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "user is not registered" });
  }
  // comapare the password using bcrypt
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.json({ message: "password is incorrect" });
  }

  // creatimg jwt token for authentication
  const token = jwt.sign({ username: user.username }, process.env.KEY, {
    expiresIn: "1h",
  });
  res.cookie("token", token, { httpOnly: true, maxAge: 360000 });
  return res.json({ status: true, message: "login successfully" });
});

// reset password through email using nodemailer 
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "user not registered" });
    }

    const token = jwt.sign({id: user._id},process.env.KEY,{expiresIn:'5m'})


// Create a transporter using the environment variables
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // sending an email to new uer
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Verification',
        text: `http://http://localhost:5173/resetPassword/${token}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return res.json({message:"error sending email"})
        } else {
           return res.json({status:true,message:"email sent"})
        }
    });
    } catch (err) {
        console.log(err);
    }
});

export { router as UserRouter };
