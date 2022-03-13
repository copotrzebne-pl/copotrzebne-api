import { Column, DataType, Model, Table } from 'sequelize-typescript';

import { UserRole } from '../types/user-role.enum';

@Table({ tableName: 'users', underscored: true })
export class User extends Model {
  @Column({
    allowNull: false,
    type: DataType.UUID,
    primaryKey: true,
    unique: true,
    autoIncrement: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  login!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  hashedPassword!: string;

  @Column({ allowNull: false, type: DataType.ENUM(UserRole.ADMIN.toString(), UserRole.PLACE_MANAGER.toString()) })
  role!: UserRole;
}
