import { Column, DataType, HasMany, Model, Sequelize, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Supply } from '../../supplies/models/supply.model';
import { TranslatedField } from '../../types/translated-field.type';

@Table({ tableName: 'categories', underscored: true, timestamps: false })
export class Category extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.JSONB })
  name!: TranslatedField;

  @ApiProperty()
  @Column({ allowNull: true, type: DataType.INTEGER })
  priority!: number | null;

  @HasMany(() => Supply)
  supplies!: Supply[];
}
