import userModel from "../models/user.model"
import { Response } from "express";
import {redis} from "../utils/redis";

// get user by id

export const getUserById = async (id: string, res: Response
) => {
    const cachedUser = await redis.get(`user:${id}`);
    if (cachedUser) {
        return res.status(201).json({
            success: true,
            user: JSON.parse(cachedUser),
        });
    }
    const user = await userModel.findById(id);
    res.status(201).json({
        success: true,
        user,
    });
}