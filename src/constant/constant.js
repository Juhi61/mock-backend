export const api = {
  interview: {
    availableSlots: "/available-interview-slots",
    scheduleMeeting: "/schedule-meeting",
  },
  remarks: {
    addRemark: "/add-remark",
    getRemarks: "/get-remarks",
    getRemark: "/get-remark",
    updateRemark: "/update-remark",
    deleteRemark: "/delete-remark",
  },
};

export const interviewerConfig = {
  userWorkingHours: {
    "kanika@webosmotic.com": { startTime: "09:00", endTime: "18:00" },
    "manali@webosmotic.com": { startTime: "10:00", endTime: "19:00" },
  },
  timeZone: "Asia/Kolkata",
  slotDuration: 60,
};
