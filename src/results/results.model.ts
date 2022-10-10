export type Blabla = {
  date: Date;
  sets: Set[];
  exercise: string; // or exercise_id: number
};

export type MuscleGroup = {
  id: number;
  name: string;
};
export type MuscleGroupList = MuscleGroup[];

export type MuscleSubgroup = {
  id: number;
  name: string;
  muscle_group_id: number;
};
export type MuscleSubgroupList = MuscleSubgroup[];

export type UserMuscleSubgroup = MuscleSubgroup;
export type UserMuscleSubgroupList = UserMuscleSubgroup[];

export type Exercise = {
  id: number;
  name: string;
  muscle_subgroup_ids: number[];
};
export type ExerciseList = string[];

export type Set = {
  weight: number; // decimal
  reps: number; // decimal?
  exercise_id: number;
};
