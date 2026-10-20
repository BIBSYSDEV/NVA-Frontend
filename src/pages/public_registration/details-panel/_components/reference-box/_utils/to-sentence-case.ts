import { getLanguageByUri } from 'nva-language';

// Words shorter than this are ignored by the casing heuristic — short words ("of", "the", "in") are
// lowercase even in title case, so counting them would mask whether the title is title-cased.
const SIGNIFICANT_WORD_MIN_LENGTH = 4;
const CONVERT_THRESHOLD = 0.6;
const ALL_CAPS_THRESHOLD = 0.8;

// Matches a single word: either a dotted abbreviation ("U.S.", "e.g.") or a letter or digit followed by
// any letters, digits, apostrophes, or hyphens.
const wordPattern = /\p{L}(?:\.\p{L})+\.?|[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;

// Honorifics are followed by a name, so both the honorific and the word after it keep their casing
// ("Dr. Smith", "St. Olav").
const honorifics = new Set(['dr', 'mr', 'mrs', 'ms', 'prof', 'st']);

// Abbreviations that are followed by a period without ending the sentence. Single letters ("U.S.",
// "e.g.") are handled separately, see followsAbbreviation.
const abbreviations = new Set([...honorifics, 'al', 'cf', 'etc', 'vol', 'vs']);

// Captures the last word of a text. The word must be preceded by a non-letter or the start of the text,
// which is matched but not captured.
const lastWordPattern = /(?:^|[^\p{L}])(\p{L}+)$/u;

// As above, but for a text ending with a word followed by a period and whitespace ("… Dr. ").
const lastAbbreviationPattern = /(?:^|[^\p{L}])(\p{L}+)\.\s+$/u;

// Captures the start of an APA subtitle or new sentence (the position just after a colon, or after
// sentence-ending punctuation followed by whitespace) together with the first letter that follows, so
// it can be capitalised. Whitespace is required after ".?!" so tokens like "Node.js" are left alone.
const subtitleStartPattern = /(:\s*|[.?!]\s+)(\p{L})/gu;

// As above, but also matches the very start of the title (^) so the title's first letter is capitalised too.
const titleStartPattern = /(^|:\s*|[.?!]\s+)(\p{L})/gu;

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

const norwegianLanguageCodes = ['nob', 'nno'];

const isNorwegian = (languageUri: string | undefined): boolean =>
  !!languageUri && norwegianLanguageCodes.includes(getLanguageByUri(languageUri).iso6393Code);

// A single capital letter ("Hepatitis B", "Phase I", the pronoun "I"). "A" is excluded since it is
// usually the article, and in Norwegian titles "I" is excluded since it is usually the preposition "i".
const isSingleCapital = (word: string, norwegian: boolean): boolean =>
  /^\p{Lu}$/u.test(word) && word !== 'A' && !(norwegian && word === 'I');

const isHonorific = (word: string, textAfter: string): boolean =>
  honorifics.has(word.toLowerCase()) && textAfter.startsWith('.');

const followsHonorific = (textBefore: string): boolean => {
  const previousWord = textBefore.match(lastAbbreviationPattern)?.[1];
  return !!previousWord && honorifics.has(previousWord.toLowerCase());
};

// In title-case input, acronyms, single capital letters, honorifics and the name after an honorific
// keep their casing.
const shouldPreserveCase = (word: string, textBefore: string, textAfter: string, norwegian: boolean): boolean =>
  isAcronym(word) || isSingleCapital(word, norwegian) || isHonorific(word, textAfter) || followsHonorific(textBefore);

// True when the text ends with an abbreviation, so a period right after it doesn't end the sentence.
const followsAbbreviation = (textBeforePeriod: string): boolean => {
  const lastWord = textBeforePeriod.match(lastWordPattern)?.[1];
  return !!lastWord && (lastWord.length === 1 || abbreviations.has(lastWord.toLowerCase()));
};

// Capitalises the first letter after each colon or sentence-ending punctuation (the start of an APA
// subtitle or a new sentence) and, only for the first segment of the title, the title's very first letter.
// A period after an abbreviation ("U.S.", "etc.") is not treated as the end of a sentence.
const capitaliseSentenceStarts = (segment: string, atTitleStart: boolean): string =>
  segment.replace(
    atTitleStart ? titleStartPattern : subtitleStartPattern,
    (match: string, prefix: string, letter: string, offset: number) =>
      prefix.startsWith('.') && followsAbbreviation(segment.slice(0, offset)) ? match : prefix + letter.toUpperCase()
  );

// Lowercases ordinary words and capitalises sentence starts, leaving parenthesised spans untouched
// so their casing is preserved verbatim.
const convertOutsideParentheses = (title: string, preserveCasing: boolean, norwegian: boolean): string =>
  title
    .split(parentheticalPattern)
    .map((segment, index) => {
      if (index % 2 === 1) {
        return segment; // a parenthesised group — preserve verbatim
      }
      const lowered = segment.replace(wordPattern, (word: string, offset: number) =>
        preserveCasing &&
        shouldPreserveCase(word, segment.slice(0, offset), segment.slice(offset + word.length), norwegian)
          ? word
          : word.toLowerCase()
      );
      return capitaliseSentenceStarts(lowered, index === 0);
    })
    .join('');

/**
 * Converts a title to sentence case, but only when it looks like it was entered in all-caps or title
 * case (see {@link shouldConvert}). Titles that already read as sentence case are returned untouched.
 *
 * When converting, capitalisation is preserved for: the first letter of the title, the first word
 * after a colon or sentence-ending punctuation (the start of an APA subtitle or a new sentence), and
 * anything inside parentheses. For title-case input, acronyms (DNA, NASA, U.S.), single capital letters
 * ("Hepatitis B", "I") and honorifics with the name after them ("Dr. Smith") are preserved too; an
 * all-caps title is lowercased throughout as a best effort, since its acronyms are indistinguishable
 * from ordinary words. Other proper nouns are not detected and are lowercased.
 *
 * The title's language URI (from entityDescription.language) adjusts language-specific rules: in
 * Norwegian titles a single "I" is the preposition "i" and is lowercased.
 */
export const toSentenceCase = (title: string, languageUri?: string): string => {
  if (!title.trim() || !shouldConvert(title)) {
    return title;
  }
  return convertOutsideParentheses(title, !isAllCaps(title), isNorwegian(languageUri));
};
