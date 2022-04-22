import { Column, DataType, HasMany, Model, Sequelize, Table } from 'sequelize-typescript';
import { Demand } from '../../demands/models/demand.model';
import { ApiProperty } from '@nestjs/swagger';
import { TranslatedField } from '../../types/translated-field.type';

@Table({ tableName: 'priorities', underscored: true, timestamps: false })
export class Priority extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.JSONB })
  name!: TranslatedField;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.INTEGER })
  importance!: number;

  @HasMany(() => Demand)
  demands!: Demand[];
}
