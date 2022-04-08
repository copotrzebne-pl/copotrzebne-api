import { PlaceState } from '../../types/place.state.enum';
import { Transition } from '../../../state-machine/types/transition';

export const placeTransitions: Transition[] = [
  { startState: PlaceState.ACTIVE, endState: PlaceState.INACTIVE, name: 'DEACTIVATE' },
  { startState: PlaceState.INACTIVE, endState: PlaceState.ACTIVE, name: 'ACTIVATE' },
];
