import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { AssociatedArtifact } from '../../types/associatedArtifact.types';
import { Registration } from '../../types/registration.types';
import { getAssociatedFiles } from '../../utils/registration-helpers';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { CompareFiles } from './fields/CompareFiles';

export const MergeResultsWizardFilesTab = () => {
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceAssociatedArtifacts = sourceResult.associatedArtifacts ?? [];
  const sourceFiles = getAssociatedFiles(sourceAssociatedArtifacts);

  const { formState } = useFormContext<Registration>();
  const targetAssociatedArtifacts = useWatch({ name: 'associatedArtifacts' }) ?? [];
  const targetFiles = getAssociatedFiles(targetAssociatedArtifacts);

  const initialTargetAssociatedArtifacts = (formState.defaultValues?.associatedArtifacts ?? []) as AssociatedArtifact[];
  const initialTargetFiles = getAssociatedFiles(initialTargetAssociatedArtifacts);

  return (
    <>
      {initialTargetFiles.map((targetFile) => (
        <CompareFiles key={targetFile.identifier} targetFile={targetFile} />
      ))}

      {sourceFiles.map((sourceFile) => {
        const matchingTargetFileIndex = targetFiles.findIndex(
          (targetFile) => targetFile.identifier === sourceFile.identifier
        );
        const matchingTargetFile = matchingTargetFileIndex > -1 ? targetFiles[matchingTargetFileIndex] : undefined;
        return (
          <CompareFiles
            key={sourceFile.identifier}
            sourceFile={sourceFile}
            targetFile={matchingTargetFile}
            matchingTargetFileIndex={matchingTargetFileIndex}
          />
        );
      })}
    </>
  );
};
