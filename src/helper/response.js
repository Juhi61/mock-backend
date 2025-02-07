export const successResponse = (response, data, message, statusCode = 200) => {
  response.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (response, message, statusCode = 400) => {
  response.status(statusCode).json({
    success: false,
    message,
  });
};
