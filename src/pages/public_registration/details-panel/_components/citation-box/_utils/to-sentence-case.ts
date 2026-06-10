// Words shorter than this are ignored by the casing heuristic — short words ("of", "the", "in") are
// lowercase even in title case, so counting them would mask whether the title is title-cased.
const SIGNIFICANT_WORD_MIN_LENGTH = 4;
const CONVERT_THRESHOLD = 0.6;
const ALL_CAPS_THRESHOLD = 0.8;

// Matches a single word: a letter or digit followed by any letters, digits, apostrophes, or hyphens.
const wordPattern = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;
// Captures the start of an APA subtitle (the position just after a colon) together with the first
// letter that follows, so it can be capitalised.
const subtitleStartPattern = /(:\s*)(\p{L})/gu;
// As above, but also matches the very start of the title (^) so the title's first letter is capitalised too.
const titleStartPattern = /(^|:\s*)(\p{L})/gu;
// Splits a title around parenthesised groups, keeping the groups (every odd element) so their casing
// can be preserved verbatim.
const parentheticalPattern = /(\([^)]*\))/;

const lettersOnly = (word: string): string => word.replace(/[^\p{L}]/gu, '');

const isUpperCase = (word: string): boolean => lettersOnly(word) === lettersOnly(word).toUpperCase();

// True when a word begins with an uppercase letter, ignoring any leading punctuation.
const startsUpperCase = (word: string): boolean => {
  const firstLetter = lettersOnly(word).charAt(0);
  return firstLetter !== '' && firstLetter === firstLetter.toUpperCase();
};

const significantWords = (title: string): string[] =>
  title.split(/\s+/).filter((word) => lettersOnly(word).length >= SIGNIFICANT_WORD_MIN_LENGTH);

const fractionMatching = (title: string, predicate: (word: string) => boolean): number => {
  const significant = significantWords(title);
  return significant.length === 0 ? 0 : significant.filter(predicate).length / significant.length;
};

// Of the significant words, more than 60% starting with a capital marks all-caps or title-case input.
const shouldConvert = (title: string): boolean => fractionMatching(title, startsUpperCase) > CONVERT_THRESHOLD;

// A wholly all-caps title can't distinguish acronyms from ordinary words, so it is lowercased
// throughout; title case keeps acronyms (2+ fully-uppercase letters) intact instead.
const isAllCaps = (title: string): boolean => fractionMatching(title, isUpperCase) > ALL_CAPS_THRESHOLD;

const isAcronym = (word: string): boolean => lettersOnly(word).length >= 2 && isUpperCase(word);

const lowercaseWord = (word: string, preserveAcronyms: boolean): string =>
  preserveAcronyms && isAcronym(word) ? word : word.toLowerCase();

// Capitalises the first letter after each colon (the start of an APA subtitle) and, only for the
// first segment of the title, the title's very first letter.
const capitaliseSentenceStarts = (segment: string, atTitleStart: boolean): string =>
  segment.replace(
    atTitleStart ? titleStartPattern : subtitleStartPattern,
    (_match, prefix: string, letter: string) => prefix + letter.toUpperCase()
  );

// Lowercases ordinary words and capitalises sentence starts, leaving parenthesised spans untouched
// so their casing is preserved verbatim.
const convertOutsideParentheses = (title: string, preserveAcronyms: boolean): string =>
  title
    .split(parentheticalPattern)
    .map((segment, index) => {
      if (index % 2 === 1) {
        return segment; // a parenthesised group — preserve verbatim
      }
      const lowered = segment.replace(wordPattern, (word) => lowercaseWord(word, preserveAcronyms));
      return capitaliseSentenceStarts(lowered, index === 0);
    })
    .join('');

/**
 * Converts a title to sentence case, but only when it looks like it was entered in all-caps or title
 * case (see {@link shouldConvert}). Titles that already read as sentence case are returned untouched.
 *
 * When converting, capitalisation is preserved for: the first letter of the title, the first word
 * after a colon (the start of an APA subtitle), and anything inside parentheses. Acronyms (DNA, NASA)
 * are preserved for title-case input; an all-caps title is lowercased throughout as a best effort,
 * since its acronyms are indistinguishable from ordinary words.
 */
export const toSentenceCase = (title: string): string => {
  if (!title.trim() || !shouldConvert(title)) {
    return title;
  }
  return convertOutsideParentheses(title, !isAllCaps(title));
};
