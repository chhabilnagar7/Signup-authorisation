import express from "express";
import bcrypt from "bcrypt";
import { User } from "../Models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

// for handling Signup

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

// for handling Login 

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

  const fiveminutes = 5 * 60 * 1000; // into miliseconds

  res.cookie("token", token, { httpOnly: true, maxAge: fiveminutes });
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

    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });

    // Create a transporter using the environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // sending an email to new uer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Verification",
      text: `http://http://localhost:5173/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ message: "error sending email" });
      } else {
        return res.json({ status: true, message: "email sent" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

router.post('/reset-password/:token', async(req,res) => {
  const {token} = req.params;
  const {password} = req.body
  try{
    const decoded = await jwt.verify(token,process.env.KEY);
    const id = decoded.id;
    const hashPassword = await bcrypt.hash(password,10)
    await User.findByIdAndUpdate({_id: id}, {password:hashPassword})
    return res.json({status: true, message: "updated password"})
  }catch(err){
    return res.json("invalid token")
  }
})

// for protected routes 
const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "No token provided" });
    }
    await jwt.verify(token, process.env.KEY);
    next();
  } catch (err) {
    return res.json({ status: false, message: "Unauthorized" });
  }
}

// Verify Route
router.get("/verify", verifyUser, (req, res) => {
  return res.json({ status: true, message: "Authorized" });
});

// for logout 

router.get('/logout',(req,res) => {
  res.clearCookie('token')
  return res.json({status:true})
})

export { router as UserRouter };
