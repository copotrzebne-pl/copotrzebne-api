import { StateMachine } from '../../state-machine/state-machine';
import { Place } from '../models/place.model';
import { PlaceState } from '../types/place.state.enum';

class PlacesStateMachine extends StateMachine<Place> {
  constructor() {
    super();
    this.model = Place;
    this.transitions = [
      { startState: PlaceState.ACTIVE, endState: PlaceState.INACTIVE, name: 'DEACTIVATE' },
      { startState: PlaceState.INACTIVE, endState: PlaceState.ACTIVE, name: 'ACTIVATE' },
    ];
  }
}

const placesStateMachine = new PlacesStateMachine();

export { placesStateMachine };
