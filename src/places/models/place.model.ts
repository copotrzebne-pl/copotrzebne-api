import {
  BelongsToMany,
  Column,
  DataType,
  DefaultScope,
  Scopes,
  HasMany,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { Demand } from '../../demands/models/demand.model';
import { User } from '../../users/models/user.model';
import { UsersPlaces } from '../../users/models/users-places.model';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../../comments/models/comment.model';
import { OpeningHours } from '../../opening-hours/models/opening-hours.model';
import ForbiddenOperationError from '../../error/forbidden-operation.error';
import { Transition } from '../../state-machine/types/transition';
import { PlaceState } from '../types/place.state.enum';
import { placeTransitions } from '../services/state-machine/place.transitions';

@DefaultScope(() => ({ include: [OpeningHours] }))
@Scopes(() => ({
  active: {
    where: {
      state: PlaceState.ACTIVE,
    },
  },
  inactive: {
    where: {
      state: PlaceState.INACTIVE,
    },
  },
}))
@Table({ tableName: 'places', underscored: true })
export class Place extends Model {
  @ApiProperty()
  @Column({ primaryKey: true, defaultValue: Sequelize.fn('uuid_generate_v4') })
  id!: string;

  @ApiProperty()
  @Column({ allowNull: false })
  name!: string;

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

  @ApiProperty({ nullable: false, type: 'string', description: 'automatically slugified from name' })
  @Column({ allowNull: true, type: DataType.STRING })
  nameSlug!: string;

  @ApiProperty({ nullable: false, type: 'number' })
  @Column({ allowNull: false, type: DataType.NUMBER })
  state!: number;

  @HasMany(() => Demand)
  demands!: Demand[];

  @BelongsToMany(() => User, { through: () => UsersPlaces })
  users?: User[];

  @HasMany(() => Comment)
  comments!: Comment[];

  @ApiProperty({ nullable: false, type: () => OpeningHours })
  @HasMany(() => OpeningHours)
  openingHours!: OpeningHours[];

  @ApiProperty({
    nullable: false,
    description: 'transitions allowed to perform on this entity',
  })
  @Column({
    type: DataType.VIRTUAL,
    get() {
      return placeTransitions.filter((t) => this.getDataValue('state') === t.startState);
    },
  })
  transitions!: Transition[];

  @ApiProperty({
    nullable: true,
    type: 'string',
    description: 'virtual field that returns date of last update based on last updated demand for place',
  })
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

    set() {
      throw new ForbiddenOperationError('Cannot set virtual field lastUpdatedAt');
    },
  })
  lastUpdatedAt!: Date | null;

  @ApiProperty({
    nullable: false,
    type: 'number',
    description:
      'virtual field that returns priority of place calculated from demands with priorities we have the most of',
  })
  @Column({
    type: DataType.VIRTUAL,
    get() {
      const demands: Demand[] = this.getDataValue('demands');

      if (!demands || !demands.length) {
        return 0;
      }

      const priosWithQuantities = demands.reduce(
        (counted: Record<number, number>, demand: Demand): Record<number, number> => {
          if (demand.priority) {
            counted[demand.priority.importance]
              ? counted[demand.priority.importance]++
              : (counted[demand.priority.importance] = 1);
          }

          return counted;
        },
        {},
      );

      const prioWithLargestQuantity = +Object.keys(priosWithQuantities).reduce(
        (prio1, prio2) => (priosWithQuantities[+prio1] > priosWithQuantities[+prio2] ? prio1 : prio2),
        '0',
      );

      return prioWithLargestQuantity;
    },

    set() {
      throw new ForbiddenOperationError('Cannot set virtual field priority');
    },
  })
  priority!: number;
}
