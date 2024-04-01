import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    senderUserId: {
        type: String,
        require: true
    },
    recieverUserId: {
        type: String,
        require: true
    },
    message: {
        type: String,
        max: 500
    }
},
    {
        timestamps: true
    })

export default mongoose.model("Chat", chatSchema)