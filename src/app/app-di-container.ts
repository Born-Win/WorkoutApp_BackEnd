// // import { Module } from '@nestjs/common';
// import Bottle from 'bottlejs';
// import * as MuscleGroupRepositories from '../muscle-groups/repositories';
// import * as MuscleGroupServices from '../muscle-groups/services';

// export const diContainer = (() => {
//   const bottle = new Bottle();

//   const muscleGroupRepository =
//     new MuscleGroupRepositories.MuscleGroupRepository();

//   bottle.serviceFactory('MuscleGroupService', () => {
//     return new MuscleGroupServices.MuscleGroupService(muscleGroupRepository);
//   });

//   return bottle;
// })();
