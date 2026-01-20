import express from 'express';
import { registerationUser, activateUser, loginUser, logoutUser, updateAccessToken, getUserInfo, socialAuth } from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/register', registerationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login-user', loginUser);

userRouter.get('/logout-user', isAuthenticated, logoutUser);

userRouter.get("/refresh-token", updateAccessToken);

userRouter.get("/me", isAuthenticated, getUserInfo );

userRouter.post("/social-auth", socialAuth )

export default userRouter ;