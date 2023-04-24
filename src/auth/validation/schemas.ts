import Joi = require('joi');

type AuthInput = {
  register: {
    body: {
      email: string;
      password: string;
      confirmation_password: string;
    };
  };
};

export const authValidationSchema = {
  register: Joi.object<AuthInput['register']>({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      confirmation_password: Joi.string().required()
    }).required()
  })
};
