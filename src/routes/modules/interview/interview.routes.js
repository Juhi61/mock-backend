import { Router } from "express";
import {
  availableSlotsForInterview,
  scheduleMeting,
} from "../../../modules/interview/interview.service.js";

const router = Router();

router.post("/available-slots", async (req, res) => {
  try {
    const { emails, date } = req.body;
    const slots = await availableSlotsForInterview(emails, date);
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/schedule", async (req, res) => {
  try {
    const meeting = await scheduleMeting(req.body);
    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
