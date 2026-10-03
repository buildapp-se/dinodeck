import { STARTERS, type Dino } from './dinos.ts';
import { WON } from './dinos-won.ts';

/** All 30 animals: the 8 starters first, then the 22 that are won. */
export const DINOS: Dino[] = [...STARTERS, ...WON];
