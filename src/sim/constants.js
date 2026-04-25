export const PHASES = 8192;
export const ORDERS = 128;
export const MAX_RANK = PHASES * ORDERS - 1;

export const WORLD_PRESET = {
  width: 512,
  height: 512,
  chunkSize: 64,
};

export const TYPE = {
  NORMAL: 0,
  SEEKER: 1,
  SOCIAL: 2,
  ATTENTION: 3,
  TRANSLATOR: 4,
  CONSERVE: 5,
};

export const MSG = {
  NONE: 0,
  CLAIM: 1,
  ANOMALY: 2,
  TRANSLATE: 3,
  ATTENTION: 4,
  CONSERVE: 5,
};

export const PARADIGM_STEP = 128;
export const EXPOSURE_WINDOW = Math.floor(PHASES * 0.45);

export const UI_DEFAULTS = {
  hiddenAdvanceSpeed: 0.85,
  speed: 1,
  running: true,
};
