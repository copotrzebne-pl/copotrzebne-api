import { ForeignKey, Model, Table } from 'sequelize-typescript';

import { Place } from '../../places/models/places.model';
import { User } from './user.model';

@Table({ tableName: 'users_places', underscored: true, timestamps: false })
export class UsersPlaces extends Model {
  @ForeignKey(() => Place)
  placeId!: string;

  @ForeignKey(() => User)
  userId!: string;
}
