import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 6
    },
    profilePic: {
        type: String,
        default: ""
    },
    coverPic: {
        type: String,
        default: ""
    },
    gender:{
        type: String,
    },
    dateOfBirth:{
        type: Date,
    },
    friendRequestsFrom: {
        type: Array,
        default: []
    },
    friendRequestsSent: {
        type: Array,
        default: []
    },
    friends: {
        type: Array,
        default: []
    },
    contacts: {
        type: Array,
        default: []
    },
    currentAddress: {
        type: String,
        max: 50
    },
    permanentAddress: {
        type: String,
        max: 50
    },
    worksAt: {
        type: String,
        max: 50
    },
    school: {
        type: String,
        max: 50
    },
    college: {
        type: String,
        max: 50
    }
},
    {
        timestamps: true
    })

export default mongoose.model("User", userSchema)