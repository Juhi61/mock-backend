import Joi from "joi";

export const availableSlotsSchema = Joi.object({
  emails: Joi.array().items(Joi.string().email().required()).min(1).required().messages({
    "array.min": "At least one email is required",
    "array.base": "Emails must be an array",
    "string.email": "Invalid email format",
  }),
  date: Joi.number().optional(),
});
