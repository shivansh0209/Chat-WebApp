import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema= mongoose.Schema(
    {
        name:{
            type:"String",
            required:"true",
            trim:true
        },
        username:{
            type:"String",
            unique:true,
            required:true,
            trim:true,
            index:true
        }
        ,
        email:{
            type:"String",
            required:true,
            unique:true,
            trim:true
        },
        password:{
            type:"String",
            required:true,
            trim:true
        },
        pic: {
            type: "String",
            required:true,
            default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        },
        refreshToken:{
            type:"String"
        }
    },
    { timestaps: true }
);

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();

    this.password =await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id, 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User=mongoose.model("User",userSchema);
export default User;
