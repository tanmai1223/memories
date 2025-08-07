import mongoose from "mongoose";

const memoriesSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:String,
        required:true,
        trim:true
    },
    cloudinary_id:{
        type:String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps:true})

const Memories=mongoose.model("Memories",memoriesSchema)

export default Memories;