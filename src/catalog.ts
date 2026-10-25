import { STARTERS, type Dino } from './dinos.ts';
import { WON } from './dinos-won.ts';

/** The 8 starters first, then the animals that are won in challenges. */
export const DINOS: Dino[] = [...STARTERS, ...WON];
