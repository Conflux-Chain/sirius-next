import {
  DEFAULT_PRIVATE_TEXT_LENGTH_LIMIT,
  isValidPrivateText,
  normalizePrivateText,
} from './privateText';

export const DEFAULT_ADDRESS_LABEL_LENGTH_LIMIT =
  DEFAULT_PRIVATE_TEXT_LENGTH_LIMIT;

export interface AddressLabelRecord {
  a: string;
  l: string;
  t: number;
  u: number;
}

export const normalizeAddressLabel = normalizePrivateText;

/**
 * Private address labels are plain text. Keep the policy here so form input,
 * imported profile data, and persisted data use the same validation rules.
 */
export const isValidAddressLabel = (
  value: unknown,
  lengthLimit = DEFAULT_ADDRESS_LABEL_LENGTH_LIMIT,
): value is string => {
  return isValidPrivateText(value, lengthLimit);
};

export const sanitizeAddressLabels = (
  value: unknown,
  lengthLimit = DEFAULT_ADDRESS_LABEL_LENGTH_LIMIT,
): AddressLabelRecord[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.reduce<AddressLabelRecord[]>((validLabels, item) => {
    if (!item || typeof item !== 'object') {
      return validLabels;
    }

    const record = item as Partial<AddressLabelRecord>;
    const label = normalizeAddressLabel(record.l);

    if (
      typeof record.a !== 'string' ||
      !record.a ||
      typeof record.t !== 'number' ||
      !Number.isFinite(record.t) ||
      typeof record.u !== 'number' ||
      !Number.isFinite(record.u) ||
      !isValidAddressLabel(label, lengthLimit)
    ) {
      return validLabels;
    }

    validLabels.push({
      a: record.a,
      l: label,
      t: record.t,
      u: record.u,
    });
    return validLabels;
  }, []);
};
