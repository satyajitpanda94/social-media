import Comments from "../models/Comments.js"

export const createComment = async (req, res) => {
    try {
        const comment = new Comments({
            ...req.body
        })
        const resData = await comment.save()
        return res.status(200).json('Comment has been created.')
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getComments = async (req, res) => {
    try {
        let resData = await Comments.find({ postId: req.query.postId }).sort({ createdAt: -1 })
        return res.status(200).json(resData)
    } catch (err) {
        return res.status(500).json(err)
    }
}