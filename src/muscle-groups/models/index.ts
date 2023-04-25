import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'muscle_groups', timestamps: false })
export class MuscleGroup extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  name: string;
}
