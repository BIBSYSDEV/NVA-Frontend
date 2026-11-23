import { describe, expect, test } from 'vitest';
import { CristinProject, emptyProject } from '../../../../types/project.types';
import { isSavedProject } from './projectHelpers';

describe('isSavedProject()', () => {
  test('Returns false for a new project without id', () => {
    expect(isSavedProject(emptyProject)).toBe(false);
  });

  test('Returns true for a project with id', () => {
    const savedProject = { ...emptyProject, id: 'https://api.dev.nva.aws.unit.no/cristin/project/1' } as CristinProject;

    expect(isSavedProject(savedProject)).toBe(true);
  });
});
