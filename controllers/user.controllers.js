import dotenv from 'dotenv'
dotenv.config();//configer env varibles
import User from "../model/user.model.js";
import { findeUserByEmail } from "../service/user.service.js";
import { ApiError } from "../utils/ApiError.js";
import {sendEmailVerificationOtp} from "../utils/SendMail.js"
import {asyncWraper} from "../utils/AsyncWraper.js"
import { ApiResponse } from "../utils/ApiResponce.js";
import jwt from "jsonwebtoken"


//verify otp
const verifyEmail = asyncWraper(async (req, res) => {
    const { otp } = req.body;
console.log("otp is  :" , otp);
    // 1. Check if OTP field is present
    if (!otp) {
        throw new ApiError(400, "Validation Error", "OTP is required!");
    }

    // 2. Find the user in the database by the provided OTP
    const user = await User.findOne({ otp: otp });

    // Handle case where OTP is incorrect
    if (!user) {
        throw new ApiError(401, "Invalid OTP", "The OTP you entered is incorrect!");
    }

    // 3. Update user fields
    user.verified = true;
    user.otp = null; // Important: Clear the OTP after it has been used

    // Save the updated user document to the database
    await user.save({ validateBeforeSave: false }); // Disabling validation can prevent errors if you have other required fields in your schema

    // 4. Return a success response
    return res.status(200).json(
        new ApiResponse(200, { userId: user._id }, "Email verified successfully!")
    );
});




//signup // old
// const userSignup = asyncWraper(async (req, res) => {

//     const { firstName, lastName, email, password } = req.body;

//     // 1. Check all fields are present
//     if (!firstName || !lastName || !email || !password) {
//         throw new ApiError(400, "Validation Error"  ,"All fields are required!");
//     }

//     // 2. Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     //one existinging user if email is verify otherview no
//     if (existingUser?.verified) {
//         throw new ApiError(409, "Validation Error" ,  "User with this email already exists.");
//     }else{

//     }

//     // 3. Hash the password
//     // const hashedPassword = await bcrypt.hash(password, 10);

//     // 4. Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     // const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

//     // 5. Save the new user in the database
//     const newUser = await User.create({
//         firstName,
//         lastName,
//         email,
//         password: password,
//         otp: otp
//     });

//     //check 

//     // 6. Send verification email
//    const emailResponse =  await sendEmailVerificationOtp(newUser.email, newUser.firstName, otp);

//    console.log("Email response : " , emailResponse);


//     // 7. Send success response
    
//     return res
//         .status(201)
//         .json(
//             new ApiResponse(
//                 201, 
//                 {
//                     userId: newUser.student_id,
//                     email: newUser.email,
//                 },
//                 "User registered successfully. Please check your email to verify your account."
//             )
//         );
// });

//singup with unverify email agin with send otp
const userSignup = asyncWraper(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // 1. Validate fields
  if (!firstName || !lastName || !email || !password) {
    throw new ApiError(400, "Validation Error", "All fields are required!");
  }

  // 2. Check existing user
  const existingUser = await User.findOne({ email });

  // If verified → already registered
  if (existingUser && existingUser.verified) {
    throw new ApiError(409, "Validation Error", "User with this email already exists.");
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let user;

  if (existingUser && !existingUser.verified) {
    // 🔁 User exists but not verified → update OTP and resend
    existingUser.otp = otp;
    existingUser.firstName = firstName;
    existingUser.lastName = lastName;
    existingUser.password = password;
    await existingUser.save();

    user = existingUser;
  } else {
    // 🆕 Create new user
    user = await User.create({
      firstName,
      lastName,
      email,
      password,
      otp,
    });
  }

  // 6. Send OTP email
  const emailResponse = await sendEmailVerificationOtp(user.email, user.firstName, otp);
  console.log("Email response:", emailResponse);

  // 7. Response
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        userId: user.student_id,
        email: user.email,
      },
      existingUser
        ? "OTP resent. Please verify your email."
        : "User registered successfully. Please check your email to verify your account."
    )
  );
});



//user login
const userLogin = asyncWraper(async (req, res) => {
    // 1. Get user credentials from the request body
    const { email, password } = req.body;

    console.log("user data : " , email , password)

    if (!email || !password) {
        throw new ApiError(400, "validation Error", "Email and password are required.");
    }

    // 2. Find the user by email
    const user = await User.findOne({ email });
//   console.log("user found : " , user);
    if (!user) {
        throw new ApiError(404, "validation Error","User not found. Please check your email or sign up.");
    }

    // 3. Main check: Ensure the user's account is verified
    if (!user.verified) { // Assuming you have an 'isVerified' field in your User model
        throw new ApiError(403,  "validation Error" , "Account not verified. Please check your email for the verification OTP.");
    }

    // 4. Check if the password is correct
    // const isPasswordCorrect = await bcrypt.compare(password, user.password);
    //   console.log("user.password :" , user.password , " : passworsd" , password);
    if (user.password !== password) {
        throw new ApiError(401, "Invalid credentials " ," Please check your password.");
    }

    // 5. Generate access and refresh tokens
    const accessToken = jwt.sign({
        _id: user._id,
        student_id : user.student_id,
        email: user.email,
        firstName: user.firstName,
    }, process.env.ACCESS_TOKEN_SECRET);

    const loggedInUser = await User.findById(user._id).select("-password");

    // 7. Send tokens to the client (refresh token in cookie, access token in response body)
    // const options = {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    // };

    return res
        .status(200)
        .cookie("auth", accessToken)
        .json(
            new ApiResponse(
                200, {
                   user: loggedInUser,
                   auth : accessToken,
                },
                "User logged in successfully."
            )
        );
});


//user login
const userLogout  = asyncWraper(async(req , res) =>{

    //clear cookis




      return res
        .status(200)
        .clearCookie("auth")
        .json(
            new ApiResponse(
                200, {
                   user: req.user.email,
                },
                "User Logout  successfully."
            )
        );

})









const userFind = async(req, res)=>{
    try {
        const { email } = req.body;

        if(!email){
         return res
        .status(401)
        .json({
            message : "email is required !",
            success : false 
        });
        }

        const isUserFind = await findeUserByEmail(email);
        
        if(!isUserFind){
           
        return res
        .status(201)
        .json({
            message : "email is unique !",
            success : true,
            isEmailUnique : true
        });

        }



           return res
        .status(201)
        .json({
            message : "email is not unique !",
            success : true,
            isEmailUnique : false
        });

        
        
    } catch (error) {
        
        return res
        .status(401)
        .json({
            message : "user find error !",
            success : false 
        });

    }
}


export {
    userSignup,
    userLogin ,
    verifyEmail,
    userLogout
}