import * as bcrypt from 'bcrypt';
import config = require('config');
import {
  Table,
  Column,
  Model,
  DataType,
  BeforeSave
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  indexes: [{ unique: true, fields: ['email'] }]
})
export class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password: string;

  @Column({
    type: DataType.STRING
  })
  refresh_token: string;

  @BeforeSave
  static async hashPassword(user: User) {
    const salt = await bcrypt.genSalt(config.get('bcrypt.saltRounds'));
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
  }
}
