import { PlaceState } from '../../types/place.state.enum';
import { Transition } from '../../../state-machine/types/transition';
import { PlaceTransitionName } from '../../types/place.transition-name.enum';

export const placeTransitions: Transition[] = [
  { startState: PlaceState.ACTIVE, endState: PlaceState.INACTIVE, name: PlaceTransitionName.DEACTIVATE },
  { startState: PlaceState.INACTIVE, endState: PlaceState.ACTIVE, name: PlaceTransitionName.ACTIVATE },
];
