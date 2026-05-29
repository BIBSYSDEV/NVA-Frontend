import { Contributor, ContributorRole } from '../../../../../../types/contributor.types';
import { PagesRange } from '../../../../../../types/publication_types/pages.types';
import { Registration } from '../../../../../../types/registration.types';

const toInitials = (givenNames: string): string =>
  givenNames
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}.`)
    .join(' ');

const formatAuthorName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.includes(',')) {
    const [last, given = ''] = trimmed.split(',', 2);
    const lastName = last.trim();
    const initials = toInitials(given.trim());
    return initials ? `${lastName}, ${initials}` : lastName;
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0];
  }
  const lastName = parts[parts.length - 1];
  const initials = toInitials(parts.slice(0, -1).join(' '));
  return `${lastName}, ${initials}`;
};

/**
 * Formats a list of contributors as an APA-style author list.
 * Sorts by sequence, abbreviates given names to initials, and joins with commas / ampersand.
 * Example: [Smith, Alice; Doe, John] → "Smith, A., & Doe, J."
 */
export const formatAuthorList = (creators: Contributor[]): string => {
  const names = [...creators]
    .sort((a, b) => a.sequence - b.sequence)
    .map((contributor) => formatAuthorName(contributor.identity.name))
    .filter(Boolean);

  if (names.length === 0) {
    return '';
  }
  if (names.length === 1) {
    return names[0];
  }
  if (names.length === 2) {
    return `${names[0]}, & ${names[1]}`;
  }
  return `${names.slice(0, -1).join(', ')}, & ${names[names.length - 1]}`;
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
