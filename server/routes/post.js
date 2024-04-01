import { Router } from "express";
import { createPost, deletePost, getAllPosts, getPostById, getPostsByUserId, getSearchedPosts, getTimelinePosts, updatePostLikes } from "../controllers/postController.js";

const router = Router()

router.post('/', createPost)
router.get('/profile/:userId', getPostsByUserId)
router.get('/timeline/:userId', getTimelinePosts)
router.get('/search', getSearchedPosts)
router.put('/:id/like', updatePostLikes)
router.delete('/:id', deletePost) 
router.get('/:id', getPostById)
router.get('/', getAllPosts)

export default router; 