import User from "../models/userModel.js"
import ApiError from "../utils/ApiErrorUtility.js"
import uploadOnCloudinary from "../utils/cloudinaryUtility.js"
import asyncHandler from "../utils/ayncHandlerUtility.js"
import ApiResponse from "../utils/ApiResponseUtility.js"


const allUsers= asyncHandler(async (req,res) => {
    //after ? everything is accesses by req.query.search
    const keyword = req.query.search
    ? {
        $or: [ //$or is a normal mongodb operator
          { name: { $regex: req.query.search, $options: "i" } }, //$regex is also and operator that performs string pattern matching
          { username: { $regex: req.query.search, $options: "i" } },//options i does the matching case insensitive
        ],
      }
    : {};
      //console.log(keyword) ye keyword to as it is jaisa tum upar dekhre vaisa chala jayega find me
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
});



const registerUser=asyncHandler( async (req,res)=> {
    const {name , email , password ,username }=req.body;

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.file?.path;
    let avatar=null;
    if(avatarLocalPath){
        avatar = await uploadOnCloudinary(avatarLocalPath)
    }

    const user = await User.create({
        name,
        username,
        email,
        password,
        pic: (avatar)?(avatar.url):("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg")
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    const refreshToken=createdUser.generateRefreshToken();
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(201).cookie("refreshToken",refreshToken,options).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

}
)

const loginUser= asyncHandler(async (req,res)=>{
    const {email,username,password}=req.body;
    
    if([email,username].some((ele)=>{ele?.trim()===""})){
        return new ApiError(400,"Username or email is required")
    }
    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const refreshToken= user.generateRefreshToken();
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    req.body.user=loggedInUser
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser
            },
            "User logged In Successfully"
        )
    )

})

export { registerUser , loginUser, allUsers}