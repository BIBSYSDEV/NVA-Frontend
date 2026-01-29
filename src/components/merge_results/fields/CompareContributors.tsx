import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Contributor } from '../../../types/contributor.types';
import { Registration } from '../../../types/registration.types';
import { checkIfContributorsAreIdentical } from '../merge-results-helpers';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { CompareContributor } from './CompareContributor';

export const CompareContributors = () => {
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const { control, formState } = useFormContext<Registration>();
  const sourceContributors = sourceResult.entityDescription?.contributors ?? [];

  const targetContributors = useWatch({ name: 'entityDescription.contributors', control }) ?? [];
  const initialTargetContributors = (formState.defaultValues?.entityDescription?.contributors ?? []) as Contributor[];

  const commonContributors = sourceContributors.filter((sourceContributor) =>
    initialTargetContributors.some((targetContributor) =>
      checkIfContributorsAreIdentical(sourceContributor, targetContributor)
    )
  );

  const targetOnlyContributors = initialTargetContributors.filter(
    (targetContributor) =>
      !commonContributors.some((sourceContributor) =>
        checkIfContributorsAreIdentical(sourceContributor, targetContributor)
      )
  );

  const addableSourceContributors = sourceContributors.filter(
    (sourceContributor) =>
      !commonContributors.some((targetContributor) =>
        checkIfContributorsAreIdentical(sourceContributor, targetContributor)
      )
  );

  return (
    <>
      {commonContributors.map((contributor) => (
        <CompareContributor
          key={contributor.identity.name}
          sourceContributor={contributor}
          targetContributor={contributor}
        />
      ))}

      {targetOnlyContributors.map((targetContributor) => (
        <CompareContributor key={targetContributor.identity.name} targetContributor={targetContributor} />
      ))}

      {addableSourceContributors.map((contributor) => {
        const matchingTargetContributorIndex = targetContributors.findIndex((targetContributor) =>
          checkIfContributorsAreIdentical(targetContributor, contributor)
        );
        const matchingTargetContributor =
          matchingTargetContributorIndex > -1 ? targetContributors[matchingTargetContributorIndex] : undefined;
        return (
          <CompareContributor
            key={contributor.identity.name}
            sourceContributor={contributor}
            targetContributor={matchingTargetContributor}
            matchingTargetContributorIndex={matchingTargetContributorIndex}
          />
        );
      })}
    </>
  );
};
