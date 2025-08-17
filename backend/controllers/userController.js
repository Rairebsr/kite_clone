import User from '../model/User.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'


const createToken = (userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET)
}
const otpStore = {};  

export const sendOtp = async (req, res) => {
  
    const { phone } = req.body;
    const user = await User.findOne({phone});
    if (user && user.verified) {
        const token = createToken(user._id);
        return res.status(200).json({
            message: 'User already exists for this phone number',
            stepsCompleted: user.stepsCompleted,
            verified: user.verified,
            token,
            alreadyExists: true 
        });
    }

    console.log('sendOtp called with phone:', phone);

    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    const otp = Math.floor(100000 + Math.random() * 900000); 
    otpStore[phone] = otp;

    console.log('Sending response:', { message: 'OTP sent successfully', otp }); 
    return res.status(200).json({ message: 'OTP sent successfully', otp });


};



export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP required' });

  
  if (otpStore[phone] && otpStore[phone].toString() === otp.toString()) {
    delete otpStore[phone]; 

    
    let user = await User.findOne({ phone });

    if (user && user.verified) {
        return res.status(200).json({
            message: 'User already exists for this phone number',
            stepsCompleted: user.stepsCompleted,
            verified: user.verified,
            token,
        });
    }

    if (!user) {
      user = new User({
        phone,
        verified: false,
        userId: uuidv4(),
        stepsCompleted: {
          pan: false,
          aadhaar: false,
          profile: false,
          bank: false,
          webcam: false,
        },
      });
      await user.save();

    }
    

    const token = createToken(user._id)
    return res.status(200).json({
      message: 'OTP verified',
      stepsCompleted: user.stepsCompleted,
      verified: user.verified,
      token,
    });
  } else {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
};

//LOGIN KITE

export const login = async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ userId });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  let otpauth_url;

  if (!user.totpSecret || user.totpSecret.trim() === "") {
    console.log("user")
    const secret = speakeasy.generateSecret({
      name: `Kite Clone (${userId})`,
    });

    user.totpSecret = secret.base32;
    await user.save();
    otpauth_url = secret.otpauth_url;
  } else {
    otpauth_url = speakeasy.otpauthURL({
      secret: user.totpSecret,
      label: `Kite Clone (${userId})`,
      issuer: 'Kite Clone',
    });
  }

  qrcode.toDataURL(otpauth_url, (err, imageUrl) => {
    if (err) {
      console.error('QR Code generation error:', err);
      return res.status(500).json({ message: 'Failed to generate QR code' });
    }

    return res.status(200).json({
      message: 'TOTP QR generated',
      qrCode: imageUrl,
      otpauth_url,
    });
  });
};

export const verifytotp = async (req, res) => {
  const { userId, token } = req.body;
    console.log("Received TOTP verify request:", { userId, token });

  const user = await User.findOne({ userId });

  if (!user || !user.totpSecret) {
    return res.status(400).json({ message: 'TOTP setup incomplete or user not found' });
  }
  console.log("User's secret from DB:", user.totpSecret);

  console.log("Generated token on server:", speakeasy.totp({
  secret: user.totpSecret,
  encoding: 'base32'
}));

  
  const isVerified = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token,
    window: 1, // Allows 30s ahead or behind
  });

  if (!isVerified) {
    console.log("True");
    
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  

  const jwtToken = createToken(user._id)
  return res.status(200).json({ token: jwtToken });
};


export const profile= async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  res.json(user);
};


export const updateprofile = async (req, res) => {
  const userId = req.userId;
  const { profileDetails, panDetails, bankDetails } = req.body;
  await User.findByIdAndUpdate(userId, {
    profileDetails, panDetails, bankDetails
  });
  res.sendStatus(200);
};