import Joi from "joi";

export const registerValidation = Joi.object({
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  mobileNo: Joi.string().optional().allow(""),
  userName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.valid(Joi.ref("password")).required(),
  isEmailVerified: Joi.boolean().optional()
});

export const loginValidation = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
