import dotenv from 'dotenv'
dotenv.config();//configer env varibles
import User from "../model/user.model.js";
import jwt from "jsonwebtoken"
import { asyncWraper } from '../utils/AsyncWraper.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponce.js';




//admin login
export const adminLogin = asyncWraper(async (req, res) => {
    // 1. Get user credentials from the request body
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "validation Error", "Email and password are required.");
    }

    // 2. Find the admin by email
    const user = await User.findOne({ email: email , role : "admin" });
 

    if (!user) {
        throw new ApiError(404, "validation Error","Admin not found , Access Denied !");
    }

    // 3. Main check: Ensure the admin account is verified
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
        role : "admin"
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




