import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey
} from 'sequelize-typescript';
import { Outcome } from '../../outcomes/models';

@Table({ tableName: 'sets', timestamps: false })
export class Set extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false
  })
  reps: number;

  @Column({
    type: DataType.STRING
  })
  comment?: string;

  @ForeignKey(() => Outcome)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  outcome_id: number;
}
