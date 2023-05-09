import Joi = require('joi');

type OutcomesInput = {
  getAll: {
    query: {
      exercise_id: string;
    };
  };
  create: {
    query: {
      exercise_id: string;
      date?: string;
    };
    body: {
      data: {
        weight: string;
        comment?: string;
        sets: {
          reps: number;
          comment?: string;
        }[];
      }[];
    };
  };
  updateOne: {
    param: string; // id
    body: {
      weight: string;
    };
  };
};

const setsValidationSchema = Joi.array().items(
  Joi.object({
    reps: Joi.number().positive().required(),
    comment: Joi.string()
  }).required()
);

const createOutcomeBodyDataValidationSchema = Joi.object<
  OutcomesInput['create']['body']['data'][number]
>({
  weight: Joi.number().positive().required(), // decimal
  comment: Joi.string(),
  sets: setsValidationSchema.required()
});

export const outcomeValidationSchema = {
  getAll: Joi.object<OutcomesInput['getAll']>({
    query: Joi.object({
      exercise_id: Joi.number().integer().positive().required(), // numeric string
      date: Joi.string()
    })
  }),
  create: Joi.object<OutcomesInput['create']>({
    query: Joi.object({
      exercise_id: Joi.number().integer().positive().required() // numeric string
    }),
    body: Joi.object({
      data: Joi.array().items(createOutcomeBodyDataValidationSchema.required())
    })
  }),
  updateOne: Joi.object<OutcomesInput['updateOne']>({
    param: Joi.number().integer().positive(),
    body: Joi.object({
      weight: Joi.number().positive().required() // decimal
    })
  })
};
