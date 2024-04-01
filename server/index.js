import express from "express";
import mongoose from "mongoose";
import doenv from 'dotenv';
import morgan from "morgan";
import authRouter from "./routes/auth.js"
import postRouter from "./routes/post.js"
import userRouter from "./routes/user.js"
import chatRouter from "./routes/chat.js"
import commentRouter from "./routes/comment.js"
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express()
doenv.config()

const port = process.env.PORT || 8888

mongoose.connect(process.env.MOGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Mongodb connected'))

app.use(express.json())
app.use(cookieParser())
app.use(morgan('common'))
app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/user', userRouter)
app.use('/comment', commentRouter)
app.use('/chat', chatRouter)

app.listen(port, () => console.log('Server Started on', port))