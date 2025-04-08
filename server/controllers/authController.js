import transporter from "../config/nodemailer.js";
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import { generateVerificationToken } from "../utils/utils.js";
import bcrypt from "bcryptjs";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE,} from '../config/emailTemplates.js'
export const register = async (req, res) => {
  
    const { firstname, lastname, email, password } = req.body;

    if(!firstname || !lastname || !email || !password){
      return res.json({ success: false, message: 'All fields are required' });
    } 
    try {
      const existingUser = await userModel.findOne({email});
      if(existingUser){
        return res.json({ success: false, message: 'User already exists' })
      }

      const user = new userModel({firstname, lastname, email, password});
      await user.save();

      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'});

      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });

      res.json({
        success: true,
        message: 'User registered successfully',
        user,
        token
      })
  } catch (error) {
    res.json({ success: false, message: error.message }) 
  }
}


export const login = async(req, res) => {
  const {email, password} = req.body;
  if(!email || !password) {
    res.json({ success: false, message: 'Email and Password are required'})
  }

  try {
    const user = await userModel.findOne({email});

    if(!user){
      res.json({ success: false, message: 'Invalid Email' });
    }

    const isMatch = await user.matchedPassword(password);
    if(!isMatch){
      res.json({ success: false, message: 'Invalid Password'});
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'});

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production'
    });
 
    res.json({
      success: true,
      message: 'Login successful',
      user,
      token
    })
  
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    })
  }
}

export const logout = async (req, res) => {
  
  res.clearCookie();
  res.send('Logout successful');
};


export const sentVerifyOtp = async (req, res) => {
  try {
    const {userId} = req.body;
    const user = await userModel.findById(userId);
    if(user.isAccountVerified){
      return res.json({success: false, message: 'Account already verified'})
    }

    const otp = generateVerificationToken();
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions={
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Verification OTP',
      // text: `Your verification code is ${otp}`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    }

    await transporter.sendMail(mailOptions);

    res.json({
      success: true, message: 'Verification OTP sent to email'
    })
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}

export const verifyEmail = async (req, res) => {
  const { userId, otp} = req.body;
  if(!userId || !otp){
    res.json({success: false, message: 'All fields are required'});
  }

  try {
    const user = await userModel.findById(userId);
    if(!user){
      res.json({success: false, message: 'User not found'});
    }

    if(user.verifyOtp === '' || user.verifyOtp !== otp){
      return res.json({ success: false, message: 'Invalid OTP'});
    }

    if(user.verifyOtpExpireAt < Date.now()){
      return res.json({success: false, message: 'OTP expired'});
    }

    user.isAccountVerified = true;
    user.verifyOtp = ''
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({success: true, message: 'Email verified successfully'});
  } catch (error) {
    res.json({ success: false, message: error.message})
  }
}


// Check if user is authenticated
export const isAuthenticated = async(req, res) => {
  try {
    return res.json({success: true })
  } catch (error) {
    res.json({ success: false, message: error.message})
  }
}


// Send password reset otp
export const sendResetOtp = async(req, res) => {
  const { email } = req.body;
  if(!email){
    return res.json({ success: false, message: 'Email is required'})
  }

  try {
    const user = await userModel.findOne({email});
    if(!user){
      return res.json({success: false, message: 'User not found'})
    }

    const otp = generateVerificationToken();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() +15 * 60 * 1000;

    await user.save();

    const mailOptions={
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      // text: `Your OTP for resetting your password is ${otp}. Use this otp to reset your password.`,
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
    }

    await transporter.sendMail(mailOptions);

    return res.json({success: true, message: 'OTP sent to your email'})
  } catch (error) {
    return res.json({success: false, message: error.message})
  }
}

// Reset user password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword} = req.body;
  if(!email || !otp || !newPassword){
    return res.json({success: false, message: 'All fields are required'})
  }

  try {
    const user = await userModel.findOne({email});
    if(!user){
      return res.json({success: false, message: 'User not found'});
    }


    if(user.resetOtp === '' || user.resetOtp !== otp){
      return res.json({success: false, message: 'Invalid OTP'});
    }

    if(user.resetOtpExpireAt < Date.now()){
      return res.json({success: false, message: 'OTP expired'});
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);  
    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({success: true, message: 'Password has been reset successfully'})
  } catch (error) {
    return res.json({success: false, message: error.message})
  }

}