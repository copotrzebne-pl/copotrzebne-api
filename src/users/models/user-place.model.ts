import { ForeignKey, Model, Table } from 'sequelize-typescript';

import { Place } from '../../places/models/places.model';
import { User } from './user.model';

@Table({ tableName: 'user_place', underscored: true, timestamps: false })
export class UserPlace extends Model {
  @ForeignKey(() => Place)
  placeId!: string;

  @ForeignKey(() => User)
  userId!: string;
}
