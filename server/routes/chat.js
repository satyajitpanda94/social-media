import { Router } from "express";
import { createChat, getAllChats, getChatsById } from "../controllers/chatController.js";

const router = Router()

router.post('/', createChat)
router.get('/', getAllChats)
router.get('/:id', getChatsById)

export default router;