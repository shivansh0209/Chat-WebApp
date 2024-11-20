import ApiError from "../utils/ApiErrorUtility.js";
import asyncHandler from "../utils/ayncHandlerUtility.js";
import jwt from "jsonwebtoken"
import User from "../models/userModel.js";

const authmiddleware= asyncHandler(async (req,res,next) => {
    try{
        const token=req.cookies?.refreshToken;
        if(!token){
            throw new ApiError(400,"Unauthorized request");
        }
        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        const user= await User.findById(decodedToken._id).select("-password");
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user;
        next()
    }
    catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

export default authmiddleware;