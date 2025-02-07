import httpStatus from "http-status";
import { errorResponse } from "../helper/response.js";

export const validateRequest = (schema) => {
  return async (request, response, next) => {
    const object = {
      ...request.body,
      ...request.query,
      ...request.params,
    };
    try {
      await schema.validateAsync(object, { abortEarly: false });
      next();
    } catch (error) {
      if (error) {
        const errors = error?.details?.map((detail) => {
          return detail.message.replace(/["/\\]/g, "");
        });
        return errorResponse(response, errors?.[0], httpStatus.BAD_REQUEST);
      } else {
        return errorResponse(
          response,
          "An unexpected error occurred",
          httpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  };
};
