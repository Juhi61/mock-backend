import axios from "axios";
import { minutesToTime, timeToMinutes } from "../../utils/convert-time.js";
import { interviewerConfig } from "../../constant/constant.js";
import config from "../../config/env/index.js";

const TOKEN_CACHE_DURATION = 3500; // 58 minutes in seconds
let cachedToken = null;
let tokenExpiration = 0;

/**
 * Retrieves and caches access token for Microsoft Graph API
 * @async
 * @returns {Promise<string>} The access token
 * @throws {Error} If token retrieval fails
 */
async function getAccessToken() {
  const currentTime = Math.floor(Date.now() / 1000);

  if (cachedToken && currentTime < tokenExpiration) {
    return cachedToken;
  }

  const tokenUrl = `https://login.microsoftonline.com/${config.microsoft.tenantId}/oauth2/v2.0/token`;
  const params = new URLSearchParams({
    client_id: config.microsoft.clientId,
    client_secret: config.microsoft.clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  try {
    const response = await axios.post(tokenUrl, params);
    cachedToken = response.data.access_token;
    tokenExpiration = currentTime + TOKEN_CACHE_DURATION;
    return cachedToken;
  } catch (error) {
    throw new Error("Failed to get access token");
  }
}

/**
 * Finds common working hours among multiple users using optimized time comparison
 * @param {Array<string>} emails - Array of user email addresses
 * @returns {{start: number, end: number}} Object containing common start and end times in minutes
 */
const findCommonWorkingHours = (emails) => {
  const workingHours = emails.map((email) => ({
    start: timeToMinutes(interviewerConfig.userWorkingHours[email].startTime),
    end: timeToMinutes(interviewerConfig.userWorkingHours[email].endTime),
  }));

  const commonStart = Math.max(...workingHours.map((h) => h.start));
  const commonEnd = Math.min(...workingHours.map((h) => h.end));

  return { start: commonStart, end: commonEnd };
};

/**
 * Generates time slots efficiently using minutes-based calculations
 * @param {number} startMinutes - Start time in minutes since midnight
 * @param {number} endMinutes - End time in minutes since midnight
 * @returns {Array<{start: string, end: string, available: boolean}>} Array of time slots
 */
const generateTimeSlots = (startMinutes, endMinutes) => {
  const slots = [];
  for (let time = startMinutes; time < endMinutes; time += interviewerConfig.slotDuration) {
    slots.push({
      start: minutesToTime(time),
      end: minutesToTime(time + interviewerConfig.slotDuration),
      available: true,
    });
  }
  return slots;
};

/**
 * Efficiently fetches calendar events for multiple users in parallel
 * @async
 * @param {Array<string>} emails - Array of email addresses
 * @param {string} accessToken - Microsoft Graph API access token
 * @param {string|null} date - Optional date parameter
 * @returns {Promise<Array>} Array of user calendars with events
 */
async function fetchUserCalendars(emails, accessToken, timestamp = null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = timestamp ? new Date(parseInt(timestamp)) : new Date();
  // Validate if target date is not in the past
  if (targetDate < today) {
    throw new Error("Cannot select past dates");
  }
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);
  const fetchCalendar = async (email) => {
    try {
      const response = await axios.get(
        `${config.microsoft.graphEndpoint}/users/${email}/calendarView`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: `outlook.timezone="${interviewerConfig.timeZone}"`,
          },
          params: {
            startDateTime: startOfDay.toISOString(),
            endDateTime: endOfDay.toISOString(),
            $select: "subject,start,end,showAs",
          },
        },
      );
      return { email, meetings: response.data.value };
    } catch (error) {
      console.error(`Error fetching calendar for ${email}:`, error.message);
      return { email, meetings: [] };
    }
  };

  return Promise.all(emails.map(fetchCalendar));
}

/**
 * Checks if a slot conflicts with meetings using optimized time comparison
 * @param {{start: string, end: string}} slot - Time slot
 * @param {Array<{start: {dateTime: string}, end: {dateTime: string}}>} meetings - Meetings
 * @returns {boolean} True if there's a conflict
 */
const hasConflict = (slot, meetings) => {
  const slotStart = timeToMinutes(slot.start);
  const slotEnd = timeToMinutes(slot.end);

  return meetings.some((meeting) => {
    const meetingStart = timeToMinutes(
      new Date(meeting.start.dateTime).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
    const meetingEnd = timeToMinutes(
      new Date(meeting.end.dateTime).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
    );

    return (
      (slotStart >= meetingStart && slotStart < meetingEnd) ||
      (slotEnd > meetingStart && slotEnd <= meetingEnd) ||
      (slotStart <= meetingStart && slotEnd >= meetingEnd)
    );
  });
};

/**
 * Finds available interview slots for given emails and date
 * @async
 * @param {Array<string>} emails - Array of email addresses
 * @param {string|null} date - Optional date parameter
 * @returns {Promise<Array>} Array of available time slots
 */
export const availableSlotsForInterview = async (emails, date = null) => {
  const accessToken = await getAccessToken();
  const commonHours = findCommonWorkingHours(emails);
  const availableSlots = generateTimeSlots(commonHours.start, commonHours.end);
  const userCalendars = await fetchUserCalendars(emails, accessToken, date);

  const onlyAvailableSlots = availableSlots
    .map((slot) => {
      const conflicts = userCalendars
        .filter((userCal) => hasConflict(slot, userCal.meetings))
        .map((userCal) => ({
          email: userCal.email,
          meetings: userCal.meetings
            .filter((meeting) => hasConflict(slot, [meeting]))
            .map((meeting) => ({
              startTime: new Date(meeting.start.dateTime).toLocaleTimeString(),
              endTime: new Date(meeting.end.dateTime).toLocaleTimeString(),
              subject: meeting.subject,
            })),
        }));

      return {
        ...slot,
        available: conflicts.length === 0,
      };
    })
    .filter((slot) => slot.available);
  return onlyAvailableSlots;
};

export const scheduleMeting = async (requestData) => {
  const timeZone = interviewerConfig.timeZone;
  const { emails, startTime, endTime, subject, description } = requestData;
  const accessToken = await getAccessToken();

  // Log emails to verify the input
  console.log("Attendee emails:", emails);

  const meeting = {
    subject: subject,
    start: {
      dateTime: new Date(startTime).toISOString(),
      timeZone,
    },
    end: {
      dateTime: new Date(endTime).toISOString(),
      timeZone,
    },
    body: {
      contentType: "text",
      content: description,
    },
    attendees: emails.map((email) => ({
      emailAddress: { address: email },
      type: "required",
    })),
    isOnlineMeeting: true,
    onlineMeetingProvider: "teamsForBusiness",
  };

  // Log the full attendees array to verify structure
  console.log("Attendees array:", meeting.attendees);

  const response = await axios.post(
    `${config.microsoft.graphEndpoint}/users/${process.env.ORGANIZATION_EMAIL}/calendar/events`,
    meeting,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  return {
    meetingId: response.data.id,
    joinUrl: response.data.onlineMeeting?.joinUrl,
    createdDateTime: response.data.createdDateTime,
  };
};
