import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Sequelize, Table } from 'sequelize-typescript';
import { Demand } from '../../demands/models/demand.model';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/models/category.model';
import { TranslatedField } from '../../types/translated-field.type';

@Table({ tableName: 'supplies', underscored: true, timestamps: false })
export class Supply extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.JSONB })
  name!: TranslatedField;

  @HasMany(() => Demand)
  demand!: Demand[];

  @ApiProperty({ type: 'string', nullable: true })
  @Column({ allowNull: true, type: DataType.UUID })
  @ForeignKey(() => Category)
  categoryId!: string | null;

  @ApiProperty({ type: Category, nullable: true })
  @BelongsTo(() => Category)
  category!: Category | null;
}
