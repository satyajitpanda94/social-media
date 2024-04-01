import { Router } from "express";
import { createComment, getComments } from "../controllers/commentController.js";

const router= Router()

router.post('/',createComment)
router.get('/',getComments)

export default router;