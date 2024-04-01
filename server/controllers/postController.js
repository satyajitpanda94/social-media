import Post from "../models/Post.js"
import Users from "../models/Users.js"

export const createPost = async (req, res) => {
    try {
        const post = new Post({
            ...req.body,
        })

        const resData = await post.save()

        if (req.body.img) {
            const user = await Users.findById(req.body.userId)
            await user.updateOne({ $push: { photos: req.body.img } })
        }

        return res.status(200).json(resData)
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getPostsByUserId = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5
        let skip = (page - 1) * limit

        const posts = await Post.find({ userId: req.params.userId })
            .sort({ createdAt: -1 }).skip(skip).limit(limit)
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const getTimelinePosts = async (req, res) => {
    try {
        const user = await Users.findById(req.params.userId)
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5
        let skip = (page - 1) * limit

        let userTimelinePosts = null;

        if (user.friends.length > 0) {
            userTimelinePosts = await Post.find({ userId: { $in: [req.params.userId, ...user.friends] } })
                .sort({ createdAt: -1 }).skip(skip).limit(limit)
        } else {
            userTimelinePosts = await Post.find({})
                .sort({ createdAt: -1 }).skip(skip).limit(limit)
        }

        res.status(200).json(userTimelinePosts)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const updatePostLikes = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json('Post has been liked')
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json('Post has been disliked')
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json('post is deleted')
        } else {
            res.status(403).json('You can only delete your post')
        }
    } catch (err) {
        res.status(500).json(err)
    }
}

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const getSearchedPosts = async (req, res) => {
    try {
        const searchedPosts = await Post.find({ description: new RegExp(req.query.q, "i") })
            .sort({ createdAt: -1 })
        res.status(200).json(searchedPosts)
    } catch (err) {
        res.status(500).json(err)
    }
}

