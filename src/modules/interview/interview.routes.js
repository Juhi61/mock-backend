import { Router } from "express";
import { api } from "../../constant/constant.js";
import { getAvailableSlots, scheduleMeeting } from "./interview.controller.js";

import { availableSlotsSchema } from "./interview.validation.js";
import { validateRequest } from "../../middleware/validate-request.js";

const router = Router();

router.post(api.interview.availableSlots, validateRequest(availableSlotsSchema), getAvailableSlots);

router.post(api.interview.scheduleMeeting, scheduleMeeting);

export default router;
