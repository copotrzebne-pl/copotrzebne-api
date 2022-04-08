import { PlaceState } from '../../types/place.state.enum';

export const placesTransitions = [
  { startState: PlaceState.ACTIVE, endState: PlaceState.INACTIVE, name: 'DEACTIVATE' },
  { startState: PlaceState.INACTIVE, endState: PlaceState.ACTIVE, name: 'ACTIVATE' },
];
