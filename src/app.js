import express from "express"
import cookieparser from "cookie-parser"
import cors from "cors"

const app=express();
//TODO:


const corsOption={origin:process.env.ORIGIN,credentials:true,};
app.use(express.json({limit:"16kb"}));
app.use(express.static("public"));
app.use(cors(corsOption));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(cookieparser());


import userRoutes from "./routes/userRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"


app.use("/api/user",userRoutes)
app.use("/api/message",messageRoutes)
app.use("/api/chat",chatRoutes)


export { app };
























// app.post('/upload',upload.fields([{name:"avatar",maxCount:3}]),async (req,res) => {
//     req.files.avatar.map(async (ele)=>{
//         const public_data=await uploadOnCloudinary(ele.path)
//         console.log(public_data.url)
//     })
//     res.send("Yo!")
// })
