import express from "express";
import { getDemoVideoCipherOtp } from "../controllers/videoCipher.controller";

const videoCipherRouter = express.Router();

videoCipherRouter.post("/video/demo/:courseId", getDemoVideoCipherOtp);

export default videoCipherRouter;
