import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../types/contributor.types';
import { Registration } from '../../types/registration.types';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { CompareContributor } from './fields/CompareContributor';

export const MergeResultsWizardContributorsTab = () => {
  const { t } = useTranslation();

  const { control, formState } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceContributors = sourceResult.entityDescription?.contributors ?? [];

  const targetContributors = useWatch({ name: 'entityDescription.contributors', control }) ?? [];
  const initialTargetContributors = (formState.defaultValues?.entityDescription?.contributors ?? []) as Contributor[];

  // const targetOnlyProjects = initialTargetContributors.filter(
  //   (targetProject) => !commonProjects.some((sourceProject) => sourceProject.id === targetProject.id)
  // );

  // const addableSourceProjects = sourceProjects.filter(
  //   (sourceProject) => !commonProjects.some((targetProject) => targetProject.id === sourceProject.id)
  // );

  return (
    <>
      {targetContributors.map((contributor, index) => (
        <CompareContributor key={`${contributor.identity.name}${index}`} targetContributor={contributor} />
      ))}

      {sourceContributors.map((contributor, index) => (
        <CompareContributor key={`${contributor.identity.name}${index}`} sourceContributor={contributor} />
      ))}
    </>
  );
};
