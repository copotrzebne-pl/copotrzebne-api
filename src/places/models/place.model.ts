import {
  BelongsToMany,
  Column,
  DataType,
  DefaultScope,
  HasMany,
  HasOne,
  Model,
  Scopes,
  Sequelize,
  Table,
} from 'sequelize-typescript';
import { Demand } from '../../demands/models/demand.model';
import { User } from '../../users/models/user.model';
import { UsersPlaces } from '../../users/models/users-places.model';
import { ApiProperty } from '@nestjs/swagger';
import ForbiddenOperationError from '../../error/forbidden-operation.error';
import { Transition } from '../../state-machine/types/transition';
import { PlaceState } from '../types/place.state.enum';
import { placeTransitions } from '../services/state-machine/place.transitions';
import { TranslatedField } from '../../types/translated.field.type';
import { PlaceLink } from '../../place-links/models/place-link.model';
import { PublicAnnouncement } from '../../announcements/models/public-announcement.model';
import { InternalAnnouncement } from '../../announcements/models/internal-announcement.model';
import { AnnouncementComment } from '../../announcement-comments/models/announcement-comment.model';

@DefaultScope(() => ({
  include: [PlaceLink],
}))
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
  @Column({ allowNull: false, type: DataType.JSONB })
  name!: TranslatedField;

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
  additionalDescription!: string | null;

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

  @ApiProperty({ nullable: false, description: 'automatically slugified from name' })
  @Column({ allowNull: true, type: DataType.JSONB })
  nameSlug!: TranslatedField;

  @ApiProperty({ nullable: false, type: 'number' })
  @Column({ allowNull: false, type: DataType.NUMBER })
  state!: number;

  @ApiProperty({ nullable: true, type: 'string' })
  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  lastUpdatedAt!: Date;

  @ApiProperty({ nullable: true, type: 'string' })
  @Column({ allowNull: true, type: DataType.STRING })
  bankAccount!: string | null;

  @ApiProperty({ nullable: true, type: 'string' })
  @Column({ allowNull: true, type: DataType.STRING })
  bankAccountDescription!: string | null;

  @ApiProperty({ nullable: true, type: 'string' })
  @Column({ allowNull: true, type: DataType.STRING })
  resources!: string | null;

  @ApiProperty({ isArray: true, type: () => Demand, nullable: false })
  @HasMany(() => Demand)
  demands!: Demand[];

  @ApiProperty({ isArray: true, type: () => AnnouncementComment, nullable: false })
  @HasMany(() => AnnouncementComment)
  announcementComments!: AnnouncementComment[];

  @ApiProperty({ isArray: true, type: () => User, nullable: true })
  @BelongsToMany(() => User, { through: () => UsersPlaces })
  users?: User[];

  @ApiProperty({ type: () => PlaceLink, nullable: false })
  @HasOne(() => PlaceLink)
  placeLink!: PlaceLink;

  @ApiProperty({ isArray: true, type: () => PublicAnnouncement, nullable: false })
  @HasMany(() => PublicAnnouncement)
  publicAnnouncements!: PublicAnnouncement[];

  @ApiProperty({ isArray: true, type: () => InternalAnnouncement, nullable: false })
  @HasMany(() => InternalAnnouncement)
  internalAnnouncements!: InternalAnnouncement[];

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
