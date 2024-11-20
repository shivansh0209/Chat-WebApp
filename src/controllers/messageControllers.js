import Message from "../models/messageModel.js"
import ApiError from "../utils/ApiErrorUtility.js";
import ApiResponse from "../utils/ApiResponseUtility.js";
import asyncHandler from "../utils/ayncHandlerUtility.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";



const allMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat");
    if(!messages){
        throw new ApiError(200,"error in fetching all messages");
    }
    res.status(201).json(
        new ApiResponse(200,messages,"fetched all messages"));
});

const sendMessage= asyncHandler(async (req,res) => {
    const {content,chatId} = req.body;

    if(!content || !chatId){
        throw new ApiError(401,"Provide message and chatId both");
    }

    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }

    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, ("chat.users","name pic email"));
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.status(201).json(
        new ApiResponse(200,message,"Message sent"));

})

export {allMessages,sendMessage}