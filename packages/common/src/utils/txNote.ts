import {
  DEFAULT_PRIVATE_TEXT_LENGTH_LIMIT,
  isValidPrivateText,
  normalizePrivateText,
} from './privateText';

export const DEFAULT_TX_NOTE_LENGTH_LIMIT = DEFAULT_PRIVATE_TEXT_LENGTH_LIMIT;

const TRANSACTION_HASH_PATTERN = /^0x[0-9a-fA-F]{64}$/;

export interface TxNoteRecord {
  h: string;
  n: string;
  t: number;
  u: number;
}

export const normalizeTxNote = normalizePrivateText;

export const isValidTxNote = (
  value: unknown,
  lengthLimit = DEFAULT_TX_NOTE_LENGTH_LIMIT,
): value is string => isValidPrivateText(value, lengthLimit);

export const sanitizeTxNotes = (
  value: unknown,
  lengthLimit = DEFAULT_TX_NOTE_LENGTH_LIMIT,
): TxNoteRecord[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<TxNoteRecord[]>((validNotes, item) => {
    if (!item || typeof item !== 'object') {
      return validNotes;
    }

    const record = item as Partial<TxNoteRecord>;
    const note = normalizeTxNote(record.n);

    if (
      typeof record.h !== 'string' ||
      !TRANSACTION_HASH_PATTERN.test(record.h) ||
      typeof record.t !== 'number' ||
      !Number.isFinite(record.t) ||
      typeof record.u !== 'number' ||
      !Number.isFinite(record.u) ||
      !isValidTxNote(note, lengthLimit)
    ) {
      return validNotes;
    }

    validNotes.push({
      h: record.h,
      n: note,
      t: record.t,
      u: record.u,
    });
    return validNotes;
  }, []);
};
