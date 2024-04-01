import { Router } from "express";
import { cancleFriendRequest, followFriend, getAllUser, getSearchedUser, getUserById, sendFriendRequest, unfollowFriend, updateContacts, updateUser } from "../controllers/userController.js";

const router = Router()

router.get('/all', getAllUser)
router.get('/search', getSearchedUser)
router.get('/:id', getUserById)
router.put('/:id/add-friend-request', sendFriendRequest)
router.put('/:id/cancle-friend-request', cancleFriendRequest)
router.put('/:id/follow-friend', followFriend)
router.put('/:id/unfollow-friend', unfollowFriend)
router.put('/:id/contacts', updateContacts)
router.put('/:id', updateUser) 

export default router