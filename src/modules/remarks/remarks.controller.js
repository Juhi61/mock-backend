import { request } from "express";
import { errorResponse, successResponse } from "../../helper/response.js";
import { messages } from "../../constant/message.js";
import { addRemark } from "./remarks.dao.js";

export const createRemarks = async (reqest, response) => {
  try {
    await addRemark(request.body);
    return successResponse(response, messages.remarkAdded, 200);
  } catch (error) {
    return errorResponse(response, error.message);
  }
};

export const getRemarks = (req, res) => {
  res.send("Get Remarks");
};

export const getRemark = (req, res) => {
  res.send("Get Remark");
};

export const updateRemark = (req, res) => {
  res.send("Update Remark");
};

export const deleteRemark = (req, res) => {
  res.send("Delete Remark");
};
