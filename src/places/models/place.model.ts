import { BelongsToMany, Column, DataType, HasMany, Model, Sequelize, Table } from 'sequelize-typescript';
import { Demand } from '../../demands/models/demand.model';
import { User } from '../../users/models/user.model';
import { UsersPlaces } from '../../users/models/users-places.model';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../../comments/models/comment.model';
import { slugify } from '../../helpers/slugifier';

@Table({ tableName: 'places', underscored: true })
export class Place extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty()
  @Column({ allowNull: false })
  get name(): string {
    return this.getDataValue('name');
  }

  set name(value: string) {
    this.setDataValue('name', value);
    this.setDataValue('name_slug', slugify(value));
  }

  @ApiProperty()
  @Column({ allowNull: false })
  city!: string;

  @ApiProperty()
  @Column({ allowNull: false })
  street!: string;

  @ApiProperty()
  @Column({ allowNull: false, type: DataType.STRING(50) })
  buildingNumber!: string;

  @ApiProperty({ nullable: true, type: 'string' })
  @Column({ allowNull: true, type: DataType.STRING(50) })
  apartment!: string | null;

  @ApiProperty({ nullable: true, type: 'string' })
  @Column({ allowNull: true, type: DataType.STRING })
  comment!: string | null;

  @ApiProperty({ nullable: true, type: 'string' })
  @Column({ allowNull: true, type: DataType.STRING })
  email!: string | null;

  @ApiProperty({ nullable: true, type: 'string' })
  @Column({ allowNull: true, type: DataType.STRING })
  phone!: string | null;

  @ApiProperty({ nullable: true, type: 'number' })
  @Column({ allowNull: true, type: DataType.DECIMAL })
  latitude!: number | null;

  @ApiProperty({ nullable: true, type: 'number' })
  @Column({ allowNull: true, type: DataType.DECIMAL })
  longitude!: number | null;

  @ApiProperty({ nullable: true, type: 'string' })
  @Column({ allowNull: true, type: DataType.STRING })
  workingHours!: string | null;

  @ApiProperty({ nullable: false, type: 'string', description: 'automatically slugified from name' })
  @Column({ allowNull: true, type: DataType.STRING })
  nameSlug!: string;

  @HasMany(() => Demand)
  demands!: Demand[];

  @BelongsToMany(() => User, { through: () => UsersPlaces })
  users?: User[];

  @HasMany(() => Comment)
  comments!: Comment[];

  @Column({
    type: DataType.VIRTUAL,
    get() {
      const demands: Demand[] = this.getDataValue('demands');

      if (!demands || !demands.length) {
        return null;
      }

      const [newestDemand] = demands.sort((demand1, demand2) => {
        return demand2.updatedAt.getTime() - demand1.updatedAt.getTime();
      });

      return newestDemand.updatedAt;
    },
  })
  lastUpdatedAt!: Date | null;
}
