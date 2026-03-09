import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import {
    createCoupon,
    getAllCoupons,
    deleteCoupon,
    updateCoupon,
    applyCoupon,
} from "../controllers/coupon.controller";

const couponRouter = express.Router();

// Admin routes
couponRouter.post(
    "/create-coupon",
    isAuthenticated,
    authorizeRoles("admin"),
    createCoupon
);

couponRouter.get(
    "/get-coupons",
    isAuthenticated,
    authorizeRoles("admin"),
    getAllCoupons
);

couponRouter.put(
    "/update-coupon/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    updateCoupon
);

couponRouter.delete(
    "/delete-coupon/:id",
    isAuthenticated,
    authorizeRoles("admin"),
    deleteCoupon
);

// User route - apply coupon
couponRouter.post("/apply-coupon", isAuthenticated, applyCoupon);

export default couponRouter;
