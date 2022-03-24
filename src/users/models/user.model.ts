import { BelongsToMany, Column, DataType, Model, Sequelize, Table } from 'sequelize-typescript';

import { UserRole } from '../types/user-role.enum';
import { Place } from '../../places/models/places.model';
import { UsersPlaces } from './user-place.model';

@Table({ tableName: 'users', underscored: true })
export class User extends Model {
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  login!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  hashedPassword!: string;

  @Column({ allowNull: false, type: DataType.ENUM(UserRole.ADMIN.toString(), UserRole.PLACE_MANAGER.toString()) })
  role!: UserRole;

  @BelongsToMany(() => Place, { through: () => UsersPlaces })
  places?: Place[];
}
