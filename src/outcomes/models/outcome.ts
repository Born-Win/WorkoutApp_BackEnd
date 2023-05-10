import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany
} from 'sequelize-typescript';
import { Exercise } from '../../exercises/models/exercise';
import { Set } from '../../sets/models';

@Table({
  tableName: 'outcomes',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['exercise_id', 'date', 'weight']
    }
  ]
})
export class Outcome extends Model {
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
  weight: string;

  @Column({
    type: DataType.STRING
  })
  comment?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  date: string; // YYYY-MM-DD

  @ForeignKey(() => Exercise)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  exercise_id: number;

  @HasMany(() => Set, 'outcome_id')
  sets: Set[];
}
