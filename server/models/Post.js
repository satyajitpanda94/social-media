import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true
    },
    description: {
        type: String,
        max: 500
    },
    img: {
        type: String
    },
    video: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    }
},
    {
        timestamps: true
    })

export default mongoose.model("Post", postSchema)