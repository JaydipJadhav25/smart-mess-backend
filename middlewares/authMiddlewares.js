import dotenv from "dotenv"
dotenv.config();

import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncWraper } from "../utils/AsyncWraper.js";


export const userAuth = asyncWraper(async (req, res, next) => {
  // Get token from Authorization header or cookie
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.token;
  if (!token) {
    throw new ApiError(401, "Unauthorized", "Unauthorized Acesss ,No token provided");
  }

  

  // Verify token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


  if (!decoded?._id) {
    throw new ApiError(401, "Unauthorized", "Invalid token");
  }



  // Find user
  const user = await User.findById(decoded._id).select("-password");

  if (!user) {
    throw new ApiError(404, "User Not Found", "No user associated with this token");
  }

  // Attach user to request
  req.user = user;

  next();
});


//this for admin
export const checkAdmin = asyncWraper(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized", "Authentication required");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden", "Admin access only");
  }
  next();
});
