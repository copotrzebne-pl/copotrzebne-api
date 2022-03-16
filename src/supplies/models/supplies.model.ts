import { Column, DataType, HasMany, Model, Sequelize, Table } from 'sequelize-typescript';
import { Demand } from '../../demands/models/demands.model';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'supplies', underscored: true, timestamps: false })
export class Supply extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.STRING })
  namePl!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.STRING })
  nameUa!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.STRING })
  nameEn!: string;

  @HasMany(() => Demand)
  demand!: Demand[];
}
