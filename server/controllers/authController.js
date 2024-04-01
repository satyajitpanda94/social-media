import Users from "../models/Users.js"
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
    try {
        const existUserWithEmail = await Users.findOne({ email: req.body.email })
        if (existUserWithEmail)
            return res.status(409).json("User already present with this email")

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const user = new Users({
            ...req.body,
            password: hashedPassword
        })

        const newuser = await user.save()
        return res.status(200).json(newuser)
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const loginUser = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email })
        if (!user)
            return res.status(409).json('user not found')

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword)
            return res.status(400).json('Password is not authentic')

        const token = jwt.sign({ id: user._id }, "secretkey")
        const { email, password, ...other } = user._doc

        return res.cookie("accessToken", token, {
            httpOnly: true
        })
        .status(200)
        .json(other)
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const logoutUser=  (req,res)=>{
    res.clearCookie("accessToken",{
        secure:true,
        sameSite: "none"
    }).status(200).json("user has been logged out")
}

export const updateUserPassword = async(req,res) => { 
    try {
        const user = await Users.findById(req.params.id)

        const validPassword = await bcrypt.compare(req.body.oldPassword, user.password)
        if (!validPassword)
            return res.status(400).json('Password is not authentic')

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt)

        await user.updateOne({
            password: hashedPassword
        })

        return res.status(200).json('You have successfully updated Password.')

    } catch (err) {
        return res.status(500).json(err)
    }
 }