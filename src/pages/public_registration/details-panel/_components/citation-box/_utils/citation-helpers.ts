import { Contributor, ContributorRole } from '../../../../../../types/contributor.types';
import { PagesRange } from '../../../../../../types/publication_types/pages.types';
import { Registration } from '../../../../../../types/registration.types';

// Matches one or more commas (with adjacent whitespace) at the start or end of a string.
// Imported names sometimes arrive as "Lastname," or ", Firstname" when one name half is missing.
const edgeCommasPattern = /^,+\s*|\s*,+$/g;

interface FormatAuthorListOptions {
  /** When set to 'editor', appends " (Ed.)" for a single contributor or " (Eds.)" for two or more. */
  role?: 'editor';
}

const joinNames = (names: string[]): string => {
  if (names.length === 1) return names[0];
  if (names.length <= 20) return `${names.slice(0, -1).join(', ')}, & ${names[names.length - 1]}`;
  return `${names.slice(0, 19).join(', ')}, ... ${names[names.length - 1]}`;
};

/**
 * Formats a list of contributors as an APA-style author list, using each name as stored on the registration.
 * Names are not split or abbreviated — APA's "Last, F." convention can't be applied reliably when the
 * boundary between given names, middle names, and surnames is unknown.
 * Sorts by sequence. For 1-20 contributors all names are listed with commas and an ampersand before
 * the last entry. For 21+ contributors APA 7 truncation applies: the first 19 names, then an ellipsis,
 * then the final name with no ampersand.
 * Pass { role: 'editor' } to suffix the list with " (Ed.)" or " (Eds.)" per APA chapter conventions.
 */
export const formatAuthorList = (creators: Contributor[], options: FormatAuthorListOptions = {}): string => {
  const names = [...creators]
    .sort((a, b) => a.sequence - b.sequence)
    .map((contributor) => (contributor.identity.name ?? '').trim().replace(edgeCommasPattern, ''))
    .filter(Boolean);

  if (names.length === 0) return '';

  const joined = joinNames(names);
  if (options.role !== 'editor') return joined;
  return `${joined} ${names.length === 1 ? '(Ed.)' : '(Eds.)'}`;
};

/**
 * Formats a PagesRange as an APA-style page span.
 * Returns "begin–end" when both are present, otherwise whichever endpoint is available.
 */
export const formatPages = (pages?: PagesRange | null): string => {
  if (!pages) {
    return '';
  }
  const begin = pages.begin?.trim() ?? '';
  const end = pages.end?.trim() ?? '';
  if (begin && end) {
    return `${begin}–${end}`;
  }

  return begin || end;
};

/**
 * Builds the leading "Authors (year)." segment of an APA citation from already-formatted strings.
 * Gracefully omits whichever part is missing without leaving stray punctuation.
 */
export const formatAuthorYearSegment = (authors: string, year: string): string => {
  if (authors && year) return `${authors} (${year}).`;
  if (authors) return `${authors}.`;
  if (year) return `(${year}).`;
  return '';
};

/**
 * Joins citation segments with spaces, dropping any empty strings.
 */
export const joinNonEmpty = (segments: string[]): string => segments.filter(Boolean).join(' ');

/**
 * Returns contributors with the Creator role from a registration (the works's authors).
 */
export const getCreators = (registration: Registration): Contributor[] =>
  registration.entityDescription?.contributors?.filter(
    (contributor) => contributor.role?.type === ContributorRole.Creator
  ) ?? [];

/**
 * Returns contributors with the Editor role from a registration (e.g. editors of a parent book).
 */
export const getEditors = (registration: Registration): Contributor[] =>
  registration.entityDescription?.contributors?.filter(
    (contributor) => contributor.role?.type === ContributorRole.Editor
  ) ?? [];

/**
 * Returns the most authoritative persistent identifier for a registration.
 * Prefers the reference DOI, then the registration-level DOI, then the handle.
 * Handles can live either on registration.handle or in additionalIdentifiers (matching PublicHandles.tsx).
 */
export const getPersistentIdentifier = (registration: Registration): string => {
  const additionalHandle = registration.additionalIdentifiers?.find(
    (identifier) => identifier.type === 'HandleIdentifier' || identifier.sourceName === 'handle'
  )?.value;
  return (
    registration.entityDescription?.reference?.doi || registration.doi || registration.handle || additionalHandle || ''
  );
};

// Strips everything except letters, leaving the cased characters used to judge a word's casing.
const lettersOnly = (word: string): string => word.replace(/[^\p{L}]/gu, '');

// Words shorter than this are ignored by the casing heuristic — short words ("of", "the", "in") are
// lowercase even in title case, so counting them would mask whether the title is title-cased.
const SIGNIFICANT_WORD_MIN_LENGTH = 4;
const CONVERT_THRESHOLD = 0.6;
const ALL_CAPS_THRESHOLD = 0.8;

const significantWords = (title: string): string[] =>
  title.split(/\s+/).filter((word) => lettersOnly(word).length >= SIGNIFICANT_WORD_MIN_LENGTH);

const startsCapitalised = (word: string): boolean => {
  const first = lettersOnly(word)[0] ?? '';
  return first !== '' && first === first.toUpperCase() && first !== first.toLowerCase();
};

const isAcronym = (word: string): boolean => {
  const letters = lettersOnly(word);
  return letters.length >= 2 && letters === letters.toUpperCase();
};

// Detects all-caps or title-case input: of the significant words, more than 60% start with a capital.
const shouldConvert = (title: string): boolean => {
  const significant = significantWords(title);
  if (significant.length === 0) return false;
  const capitalised = significant.filter(startsCapitalised).length;
  return capitalised / significant.length > CONVERT_THRESHOLD;
};

// A wholly all-caps title (almost every significant word fully uppercase) can't distinguish acronyms
// from ordinary words, so it is lowercased throughout; title case preserves acronyms instead.
const isAllCaps = (title: string): boolean => {
  const significant = significantWords(title);
  if (significant.length === 0) return false;
  const fullyUpper = significant.filter((word) => lettersOnly(word) === lettersOnly(word).toUpperCase()).length;
  return fullyUpper / significant.length > ALL_CAPS_THRESHOLD;
};

const capitaliseFirstLetter = (word: string): string => word.replace(/\p{L}/u, (letter) => letter.toUpperCase());

// Splits a title into word tokens (letters/digits, plus internal apostrophes and hyphens) and runs of
// everything else (whitespace, punctuation), so the converter can transform words while tracking the
// colons and parentheses between them.
const wordOrSeparatorPattern = /[\p{L}\p{N}][\p{L}\p{N}'’-]*|[^\p{L}\p{N}]+/gu;

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
  if (!title.trim() || !shouldConvert(title)) return title;

  const allCaps = isAllCaps(title);
  const tokens = title.match(wordOrSeparatorPattern) ?? [];

  let parenDepth = 0;
  let atSentenceStart = true;
  let result = '';

  for (const token of tokens) {
    const isWord = /^[\p{L}\p{N}]/u.test(token);
    if (!isWord) {
      for (const char of token) {
        if (char === '(') parenDepth += 1;
        else if (char === ')') parenDepth = Math.max(0, parenDepth - 1);
      }
      // A colon starts the APA subtitle, whose first word is capitalised like a new sentence.
      if (token.includes(':')) atSentenceStart = true;
      result += token;
      continue;
    }

    if (parenDepth > 0) {
      result += token; // Preserve capitalisation inside parentheses.
    } else {
      const base = allCaps ? token.toLowerCase() : isAcronym(token) ? token : token.toLowerCase();
      result += atSentenceStart ? capitaliseFirstLetter(base) : base;
    }
    atSentenceStart = false;
  }

  return result;
};

/**
 * Resolves the fields every APA formatter needs: formatted author list, year, main title, and the
 * persistent identifier. Type-specific formatters spread the result and add their own fields on top.
 */
export const normalizeBaseFields = (registration: Registration) => {
  const entityDescription = registration.entityDescription;
  return {
    authors: formatAuthorList(getCreators(registration)),
    year: entityDescription?.publicationDate?.year?.trim() ?? '',
    title: entityDescription?.mainTitle?.trim() ?? '',
    pid: getPersistentIdentifier(registration),
  };
};
