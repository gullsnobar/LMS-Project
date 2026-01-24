import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth"
import { getNotification } from "../controllers/notification.controllers";
const notificationRoute = express.Router();

notificationRoute.get("/get-all-notification", isAuthenticated, authorizeRoles("admin"), getNotification)

export default notificationRoute;

