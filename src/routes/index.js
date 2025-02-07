import { Router } from "express";
import interviewRoutes from "../modules/interview/interview.routes.js";

const route = Router();
route.use("/interview", interviewRoutes);
export default route;
