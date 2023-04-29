import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType
} from 'sequelize-typescript';
import { User } from '../../users/models';
import { MuscleGroup } from '../../muscle-groups/models';

@Table({
  tableName: 'exercises',
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'name']
    }
  ]
})
export class Exercise extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {
        msg: 'Name should contain 2-30 characters',
        args: [2, 30]
      }
    }
  })
  name: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  user_id: number;

  @ForeignKey(() => MuscleGroup)
  @Column(DataType.INTEGER)
  muscle_group_id: number;
}
