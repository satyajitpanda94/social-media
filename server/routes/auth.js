import { Router } from "express";
import { loginUser, logoutUser, registerUser, updateUserPassword } from "../controllers/authController.js";

const router= Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.put('/:id/password', updateUserPassword)

export default router;