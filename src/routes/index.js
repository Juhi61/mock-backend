import { Router } from "express";
import interviewRoutes from "../modules/interview/interview.routes.js";
import remarksRoutes from "../modules/remarks/remarks.routes.js";
const route = Router();
route.use("/interview", interviewRoutes);
route.use("/remarks", remarksRoutes);
export default route;
