import { StateMachine } from '../../../state-machine/state-machine';
import { Place } from '../../models/place.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { placesTransitions } from './places.transitions';

@Injectable()
export class PlaceStateMachine extends StateMachine<Place> {
  constructor(@InjectModel(Place) private readonly placeModel: typeof Place) {
    super();
    this.model = placeModel;
    this.transitions = placesTransitions;
  }
}
