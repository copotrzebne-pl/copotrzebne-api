import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'places' })
export class Place extends Model {
  @Column
  name!: string;

  @Column
  city!: string;

  @Column
  street!: string;
}
