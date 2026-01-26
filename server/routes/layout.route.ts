import express from "express";
import {
    createLayout,
    editLayout,
    getLayoutByType
} from "../controllers/layout.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/create-layout", isAuthenticated, authorizeRoles("admin"), createLayout);
router.put("/edit-layout", isAuthenticated, authorizeRoles("admin"), editLayout);
router.get("/get-layout/:type", getLayoutByType);


export default router;