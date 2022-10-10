import { DataType, Sequelize, ModelCtor, Model } from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface MuscleGroupAttributes {
  id: number;
  name: string;
}

/* eslint-disable-next-line */
export interface MuscleGroupInput extends Optional<MuscleGroupAttributes, 'id'> {}

export type MuscleGroup = ModelCtor<Model>;

export function buildModel(sequelize: Sequelize) {
  const MuscleGroup = sequelize.define('muscle_group', {
    id: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataType.STRING,
      allowNull: false
    }
  });

  return MuscleGroup;
}
