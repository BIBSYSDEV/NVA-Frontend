import { Divider, Typography } from '@mui/material';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ResearchProject } from '../../../types/project.types';
import { Registration } from '../../../types/registration.types';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { CompareProject } from './CompareProject';
import { MissingCompareValues } from './MissingCompareValues';

export const CompareProjects = () => {
  const { t } = useTranslation();

  const { control, formState } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceProjects = sourceResult.projects;

  const targetProjects = useWatch({ name: 'projects', control });
  const initialTargetProjects = (formState.defaultValues?.projects ?? []) as ResearchProject[];

  const commonProjects = sourceProjects.filter((sourceProject) =>
    initialTargetProjects.some((targetProject) => targetProject.id === sourceProject.id)
  );

  const targetOnlyProjects = initialTargetProjects.filter(
    (targetProject) => !commonProjects.some((sourceProject) => sourceProject.id === targetProject.id)
  );

  const addableSourceProjects = sourceProjects.filter(
    (sourceProject) => !commonProjects.some((targetProject) => targetProject.id === sourceProject.id)
  );

  return (
    <>
      <Typography variant="h4" sx={{ display: { xs: 'none', md: 'block' } }}>
        {t('registration.description.project_association')}
      </Typography>
      <Typography variant="h4" sx={{ gridColumn: { xs: 1, md: 3 } }}>
        {t('registration.description.project_association')}
      </Typography>

      {initialTargetProjects.length === 0 && sourceProjects.length === 0 && <MissingCompareValues />}

      {targetOnlyProjects.map((project) => (
        <CompareProject key={project.id} targetProject={project} />
      ))}

      {commonProjects.map((project) => (
        <CompareProject key={project.id} sourceProject={project} targetProject={project} />
      ))}

      {addableSourceProjects.map((project) => {
        const matchingTargetProjectIndex = targetProjects.findIndex((targetProject) => targetProject.id === project.id);
        const matchingTargetProject =
          matchingTargetProjectIndex > -1 ? targetProjects[matchingTargetProjectIndex] : undefined;
        return (
          <CompareProject
            key={project.id}
            sourceProject={project}
            targetProject={matchingTargetProject}
            matchingTargetProjectIndex={matchingTargetProjectIndex}
          />
        );
      })}

      <Divider sx={{ gridColumn: '1/-1', my: '0.5rem', display: { xs: 'none', md: 'block' } }} />
    </>
  );
};
