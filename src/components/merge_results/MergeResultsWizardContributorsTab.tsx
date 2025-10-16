import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Registration } from '../../types/registration.types';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { CompareContributor } from './fields/CompareContributor';

export const MergeResultsWizardContributorsTab = () => {
  const { control } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceContributors = sourceResult.entityDescription?.contributors ?? [];

  const targetContributors = useWatch({ name: 'entityDescription.contributors', control }) ?? [];

  return (
    <>
      {targetContributors.map((contributor, index) => (
        <CompareContributor
          key={contributor.identity.id || `${contributor.identity.name}${index}`}
          targetContributor={contributor}
        />
      ))}

      {sourceContributors.map((contributor, index) => (
        <CompareContributor
          key={contributor.identity.id || `${contributor.identity.name}${index}`}
          sourceContributor={contributor}
        />
      ))}
    </>
  );
};
