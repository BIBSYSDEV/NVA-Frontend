import { describe, expect, test } from 'vitest';
import { allPublicationInstanceTypes, BookType, JournalType } from '../types/publicationFieldNames';
import { getDisabledCategoriesOutside } from './correctionListHelpers';

const disabledText = 'Not available';

describe('getDisabledCategoriesOutside', () => {
  test('does not disable the allowed types', () => {
    const disabledCategories = getDisabledCategoriesOutside(
      [BookType.AcademicMonograph, BookType.Anthology],
      disabledText
    );
    const disabledTypes = disabledCategories.map((category) => category.type);

    expect(disabledTypes).not.toContain(BookType.AcademicMonograph);
    expect(disabledTypes).not.toContain(BookType.Anthology);
  });

  test('disables every other type with the given text', () => {
    const allowedTypes = Object.values(BookType);
    const disabledCategories = getDisabledCategoriesOutside(allowedTypes, disabledText);

    expect(disabledCategories).toHaveLength(allPublicationInstanceTypes.length - allowedTypes.length);
    expect(disabledCategories).toContainEqual({ type: JournalType.AcademicArticle, text: disabledText });
    expect(disabledCategories.every((category) => category.text === disabledText)).toBe(true);
  });

  test('disables all types when no types are allowed', () => {
    const disabledCategories = getDisabledCategoriesOutside([], disabledText);

    expect(disabledCategories.map((category) => category.type)).toEqual(allPublicationInstanceTypes);
  });
});
