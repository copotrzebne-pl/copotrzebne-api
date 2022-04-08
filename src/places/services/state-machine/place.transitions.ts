import { PlaceState } from '../../types/place.state.enum';

export const placeTransitions = [
  { startState: PlaceState.ACTIVE, endState: PlaceState.INACTIVE, name: 'DEACTIVATE' },
  { startState: PlaceState.INACTIVE, endState: PlaceState.ACTIVE, name: 'ACTIVATE' },
];
