import Joi = require('joi');

type ExercisesInput = {
  getAll: {
    query: {
      muscle_group_id: number;
    };
  };
  createOne: {
    body: {
      name: string;
      user_id: number;
      muscle_group_id: number;
    };
  };
  renameOne: {
    body: {
      name: string;
    };
    param: string; // id
  };
};

export const exerciseValidationSchema = {
  getAll: Joi.object<ExercisesInput['getAll']>({
    query: Joi.object({
      muscle_group_id: Joi.number().positive().required() // numeric string
    }).required()
  }),
  createOne: Joi.object<ExercisesInput['createOne']>({
    body: Joi.object({
      name: Joi.string().min(2).max(30).required(),
      user_id: Joi.number().positive().required(),
      muscle_group_id: Joi.number().positive().required()
    }).required()
  }),
  renameOne: Joi.object<ExercisesInput['renameOne']>({
    body: Joi.object({
      name: Joi.string().min(2).max(30).required()
    }),
    param: Joi.number().integer().positive()
  })
};
