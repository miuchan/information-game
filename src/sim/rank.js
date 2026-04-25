import { MAX_RANK, PHASES } from './constants';

export const phaseOf = (rank) => rank % PHASES;
export const orderOf = (rank) => Math.floor(rank / PHASES);
export const makeRank = (order, phase) => Math.min(MAX_RANK, order * PHASES + phase);
export const clampRank = (rank) => Math.max(0, Math.min(MAX_RANK, rank));
