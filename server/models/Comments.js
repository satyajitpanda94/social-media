import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true
    },
    desc: {
        type: String,
        max: 500
    }
},
    {
        timestamps: true
    })

export default mongoose.model("Comment", commentSchema)