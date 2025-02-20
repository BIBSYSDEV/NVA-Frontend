import { AssociatedFile, FileAllowedOperation } from '../types/associatedArtifact.types';

export const hasFileAccessRight = (file: AssociatedFile, operation: FileAllowedOperation) => {
  return file.allowedOperations?.includes(operation) ?? false;
};
