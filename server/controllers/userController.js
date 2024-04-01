import Users from "../models/Users.js"

export const getUserById = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)

        if (!user)
            return res.status(404).json('user not found')

        const { email, password, ...other } = user._doc
        return res.status(200).json(other)
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const updateUser = async (req, res) => {
    const userDataToUpdate = req.body

    try {
        const user = await Users.findById(req.params.id)

        if (!user)
            return res.status(404).json('user not found')

        await Object.keys(userDataToUpdate)
            .forEach((objectKey) => (userDataToUpdate[objectKey] === '' || userDataToUpdate[objectKey] == null) && delete userDataToUpdate[objectKey]);

        const updatedUser = await Users.findByIdAndUpdate(req.params.id, { $set: { ...userDataToUpdate } }, { new: true })


        const { email, password, ...otherUpdatedData } = updatedUser._doc
        return res.status(200).json(otherUpdatedData)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const getAllUser = async (req, res) => {
    try {
        const users = await Users.find({}).select('-password -email')
        return res.status(200).json(users)
    } catch (err) {
        res.status(500).json(err)
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        const friendRequestTo = await Users.findById(req.body.friendRequestTo)

        if (!user.friendRequestsSent.includes(req.body.friendRequestTo)) {
            await user.updateOne({ $push: { friendRequestsSent: req.body.friendRequestTo } })
            await friendRequestTo.updateOne({ $push: { friendRequestsFrom: req.params.id } })
            return res.status(200).json('You have successfully sent friend request.')
        } else {
            return res.status(403).json('You have already sent friend request.')
        }
    } catch (err) {
        return res.status(500).json(err)
    }
}
export const cancleFriendRequest = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        const friendRequestTo = await Users.findById(req.body.friendRequestTo)

        if (user.friendRequestsSent.includes(req.body.friendRequestTo)) {
            await user.updateOne({ $pull: { friendRequestsSent: req.body.friendRequestTo } })
            await friendRequestTo.updateOne({ $pull: { friendRequestsFrom: req.params.id } })
            return res.status(200).json('You have successfully cancled friend request.')
        } else {
            return res.status(403).json('You have already cancled friend request.')
        }
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const followFriend = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        const friendRequestFrom = await Users.findById(req.body.friendRequestFrom)

        await user.updateOne({
            $push: { friends: req.body.friendRequestFrom },
            $pull: { friendRequestsFrom: req.body.friendRequestFrom }
        })
        await friendRequestFrom.updateOne({
            $push: { friends: req.params.id },
            $pull: { friendRequestsSent: req.params.id }
        })

        return res.status(200).json('You have successfully make friend.')

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const unfollowFriend = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        const friend = await Users.findById(req.body.friendId)

        await user.updateOne({
            $pull: { friends: req.body.friendId },
        })
        await friend.updateOne({
            $pull: { friends: req.params.id },
        })

        return res.status(200).json('You have successfully unfollow friend.')

    } catch (err) {
        return res.status(500).json(err)
    }
}

export const getSearchedUser = async (req, res) => {
    try {
        const searchedUsers = await Users.find({ name: new RegExp(req.query.q, "i") })
            .select('-password -email')
        return res.status(200).json(searchedUsers)
    } catch (err) {
        return res.status(500).json(err)
    }
}

export const updateContacts = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        const reciever = await Users.findById(req.body.recieverId)

        await user.updateOne({
            $pull: { contacts: req.body.recieverId },
        })
        await user.updateOne({
            $push: { contacts: req.body.recieverId },
        })
        await reciever.updateOne({
            $pull: { contacts: req.params.id },
        })
        await reciever.updateOne({
            $push: { contacts: req.params.id },
        })

        return res.status(200).json('You have successfully updated contacts.')

    } catch (err) {
        return res.status(500).json(err)
    }
}