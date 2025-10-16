import { Box } from '@mui/material';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../types/contributor.types';
import { Registration } from '../../types/registration.types';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

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
        <Box key={`${contributor.identity.name}${index}`} sx={{ gridColumn: { xs: 1, md: 3 } }}>
          {contributor.identity.name}
        </Box>
      ))}

      {sourceContributors.map((contributor, index) => (
        <Box key={`${contributor.identity.name}${index}`} sx={{ gridColumn: 1 }}>
          {contributor.identity.name}
        </Box>
      ))}
    </>
  );
};
