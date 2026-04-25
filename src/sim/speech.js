import { MSG, TYPE } from './constants';

export function generateMessage(i, arrays) {
  const { type, rank, anomaly, confusion, confidence, energy, messageKind, messageRank, messageStrength } = arrays;

  let kind = MSG.CLAIM;
  if (anomaly[i] > 145) kind = MSG.ANOMALY;
  if (confusion[i] > 160 && type[i] !== TYPE.TRANSLATOR) kind = MSG.ATTENTION;
  if (type[i] === TYPE.TRANSLATOR && confusion[i] > 80) kind = MSG.TRANSLATE;
  if (type[i] === TYPE.CONSERVE && confidence[i] > 140) kind = MSG.CONSERVE;

  const strengthBase = confidence[i] * 0.4 + energy[i] * 0.35 + (255 - confusion[i]) * 0.25;
  const strength = Math.max(8, Math.min(255, Math.floor(strengthBase)));

  messageKind[i] = kind;
  messageRank[i] = rank[i];
  messageStrength[i] = strength;
}
