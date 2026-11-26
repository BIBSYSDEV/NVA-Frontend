/**
 * Factories for file entities. Each factory returns the smallest valid file with typed defaults, so a test only has
 * to state the fields it actually asserts on.
 */
import { AssociatedFile, emptyFile, FileType } from '../../../types/associatedArtifact.types';

/**
 * Builds a file the user is allowed to edit the metadata of.
 *
 * @param overrides Fields to override on the default file.
 * @returns A file that is safe to mutate.
 */
export const makeFile = (overrides: Partial<AssociatedFile> = {}): AssociatedFile => ({
  ...structuredClone(emptyFile),
  type: FileType.OpenFile,
  allowedOperations: ['delete', 'download', 'write-metadata'],
  ...overrides,
});

/**
 * Builds a file the user is not allowed to edit the metadata of, so its license is locked.
 *
 * @param overrides Fields to override on the default file.
 * @returns A file that is safe to mutate.
 */
export const makeLockedFile = (overrides: Partial<AssociatedFile> = {}): AssociatedFile =>
  makeFile({ allowedOperations: ['download'], ...overrides });
