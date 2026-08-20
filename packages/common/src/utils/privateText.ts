export const DEFAULT_PRIVATE_TEXT_LENGTH_LIMIT = 20;

const HTML_TAG_CHARACTER_PATTERN = /[<>]/;
const URL_LIKE_PREFIX_PATTERN = /^(?:[a-z][a-z\d+.-]*:|\/\/|www\.)/i;

const hasControlCharacter = (value: string): boolean =>
  Array.from(value).some(character => {
    const codePoint = character.codePointAt(0) || 0;
    return (
      (codePoint >= 0 && codePoint <= 0x1f) ||
      (codePoint >= 0x7f && codePoint <= 0x9f)
    );
  });

export const normalizePrivateText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

/**
 * Private profile fields are rendered as text. Keep persisted and imported
 * values within the same plain-text policy used by form validation.
 */
export const isValidPrivateText = (
  value: unknown,
  lengthLimit = DEFAULT_PRIVATE_TEXT_LENGTH_LIMIT,
): value is string => {
  const text = normalizePrivateText(value);

  return (
    typeof value === 'string' &&
    text.length > 0 &&
    text.length <= lengthLimit &&
    !hasControlCharacter(text) &&
    !HTML_TAG_CHARACTER_PATTERN.test(text) &&
    !URL_LIKE_PREFIX_PATTERN.test(text)
  );
};
