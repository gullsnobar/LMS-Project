import express from 'express';
import { registerationUser, activateUser, loginUser, logoutUser, updateAccessToken, getUserInfo, socialAuth, updateUserInfo, updatePassword, updateProfilePicture, getAllUsers, updateUserRole, deleteUser, deleteCourse } from '../controllers/user.controller';
import { isAuthenticated, authorizeRoles } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/register', registerationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post('/login-user', loginUser);

userRouter.get('/logout-user', isAuthenticated, logoutUser);

userRouter.get("/refresh-token", updateAccessToken);

userRouter.get("/me", isAuthenticated, getUserInfo );

userRouter.post("/social-auth", socialAuth );

userRouter.put("/update-user-info", isAuthenticated, updateUserInfo );

userRouter.put("/update-user-password", isAuthenticated, updatePassword );

userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture );

userRouter.get("/get-users", isAuthenticated, authorizeRoles("admin"), getAllUsers );

userRouter.put("/update-user-role", isAuthenticated, authorizeRoles("admin"), updateUserRole );

userRouter.delete("/delete-user", isAuthenticated, authorizeRoles("admin"), deleteUser );

userRouter.delete("/delete-course/id", isAuthenticated, authorizeRoles("admin"), deleteCourse );

export default userRouter ;