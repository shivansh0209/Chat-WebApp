import asyncHandler from "../utils/ayncHandlerUtility.js"
import ApiError from "../utils/ApiErrorUtility.js";
import ApiResponse from "../utils/ApiResponseUtility.js";
import Chat from "../models/chatModel.js"
import User from "../models/userModel.js";

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ApiError(401,"Provide userId")
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate("users", "-password").populate("latestMessage");

  isChat = await User.populate(isChat,("latestMessage.sender","name pic email"));

  if (isChat.length > 0) {
    res.send(isChat[0]);
  }
  else{
    var chatData={
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
    };
    const createdChat = await Chat.create(chatData);
    if(!createdChat){throw new ApiError(401,"Something went wrong while creating new chat")}
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users","-password");
    if(!FullChat){throw new ApiError(401,"Something went wrong while creating new chat")}

    res.status(201).json(
        new ApiResponse(200,FullChat,"Accessed this Chat"));
  }
});


const fetchChats = asyncHandler(async (req, res) => {
  var allChatsofUser=await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: -1 })
  if(!allChatsofUser){
    throw new ApiError(401,"Error occured in fetching chats")
  }
  allChatsofUser=await User.populate(allChatsofUser,("latestMessage.sender","name pic email"));
  res.status(201).json(
    new ApiResponse(200,allChatsofUser,"fetched all Chats"));
});



const createGroupChat=asyncHandler(async (req,res) => {
  const{groupChatName} = req.body;

  var users = JSON.parse(req.body.users);

  if(!users || !groupChatName){
    throw new ApiError(401,"Provied all fields")
  }

  if(users.length<2){
    throw new ApiError(401,"more than two users are reqquired two form a group")
  }

  users.push(req.user);

  var newGroupChat={
    chatName:groupChatName,
    isGroupChat:true,
    users,
    groupAdmin:req.user._id
  }

  const groupChat=await Chat.create(newGroupChat);
  if(!groupChat){
    throw new ApiError(401,"Something went wrong while making group chat")
  }
  const fullNewGroupChat=await Chat.findById(groupChat._id).populate("users","-password").populate("groupAdmin","-password")

  res.status(201).json(
    new ApiResponse(200,fullNewGroupChat,"Created Group succesfully"));
})

const renameGroup= asyncHandler(async (req,res) => {
  const {chatName,chatId}=req.body;
  if(!chatName || !chatId){
    throw new ApiError(401,"Required field were not filled")
  }
  await Promise.resolve(Chat.findByIdAndUpdate(chatId,{chatName})).catch((err)=>{
    throw new ApiError(401,"Error while updating")
  })
  let finalChat=await Chat.findById(chatId).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage")
  finalChat = await User.populate(finalChat, ("latestMessage.sender","name pic email"));
  res.status(201).json(
    new ApiResponse(200,finalChat,"HoGayaUpdate"));
})


const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  await Promise.resolve(Chat.findByIdAndUpdate(chatId,{$push: { users: userId },})).catch((err)=>{
    throw new ApiError(401,"Error while updating")
  })
  const finalbaba=await Chat.findById(chatId).populate("users", "-password").populate("groupAdmin", "-password");;
  res.status(201).json(
    new ApiResponse(200,finalbaba,"HoGayaUpdate"));

});


const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

export {accessChat,createGroupChat,fetchChats,renameGroup,addToGroup,removeFromGroup};