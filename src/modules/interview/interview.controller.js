import { messages } from "../../constant/message.js";
import { errorResponse, successResponse } from "../../helper/response.js";
import { availableSlotsForInterview, scheduleMeting } from "./interview.service.js";

export const getAvailableSlots = async (request, response) => {
  try {
    const { emails, date } = request.body;
    const availableSlots = await availableSlotsForInterview(emails, date);
    return successResponse(response, availableSlots, messages.availableSlots);
  } catch (error) {
    return errorResponse(response, error.message);
  }
};

export const scheduleMeeting = async (request, response) => {
  try {
    const { emails, startTime, endTime, subject, description } = request.body;
    const meetingDetails = await scheduleMeting({
      emails,
      startTime,
      endTime,
      subject,
      description,
    });
    return successResponse(response, meetingDetails, messages.meetingScheduled);
  } catch (error) {
    return errorResponse(response, error.message);
  }
};
