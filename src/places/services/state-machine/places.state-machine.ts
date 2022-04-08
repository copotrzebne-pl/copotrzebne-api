import { StateMachine } from '../../../state-machine/state-machine';
import { Place } from '../../models/place.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { placeTransitions } from './place.transitions';

@Injectable()
export class PlacesStateMachine extends StateMachine<Place> {
  constructor(@InjectModel(Place) private readonly placeModel: typeof Place) {
    super();
    this.model = placeModel;
    this.transitions = placeTransitions;
  }
}
