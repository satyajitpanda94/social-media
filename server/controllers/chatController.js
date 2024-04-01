import Chat from "../models/Chat.js"

export const createChat = async (req, res) => {
    try {
        const chat = new Chat({
            ...req.body,
        })

        const resData = await chat.save()
        return res.status(200).json(resData)
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find({})
        return res.status(200).json(chats)
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getChatsById = async (req, res) => {
    try {
        const chats = await Chat.find({
            senderUserId: { $in: [req.params.id, req.query.recieverId] },
            recieverUserId: { $in: [req.query.recieverId, req.params.id] }
        })
        return res.status(200).json(chats)
    } catch (err) {
        return res.status(500).json(err)
    }
}
 