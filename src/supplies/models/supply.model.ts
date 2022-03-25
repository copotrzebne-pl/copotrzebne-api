import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Sequelize, Table } from 'sequelize-typescript';
import { Demand } from '../../demands/models/demand.model';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/models/category.model';

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

  @ApiProperty({ type: 'string', nullable: true })
  @Column({ allowNull: true, type: DataType.UUID })
  @ForeignKey(() => Category)
  categoryId!: string | null;

  @ApiProperty({ type: Category, nullable: true })
  @BelongsTo(() => Category)
  category!: Category | null;
}
