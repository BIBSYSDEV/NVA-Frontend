import { Typography } from '@mui/material';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ResearchProject } from '../../../types/project.types';
import { Registration } from '../../../types/registration.types';
import { isOnImportPage } from '../../../utils/urlPaths';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { CompareProject } from './CompareProject';

export const CompareProjects = () => {
  const { t } = useTranslation();

  const { control, formState } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceProjects = sourceResult.projects;

  const targetProjects = useWatch({ name: 'projects', control });
  const initialTargetProject = (formState.defaultValues?.projects ?? []) as ResearchProject[];

  const commonProjects = sourceProjects.filter((sourceProject) =>
    initialTargetProject.some((targetProject) => targetProject.id === sourceProject.id)
  );

  const targetOnlyProjects = initialTargetProject.filter(
    (targetProject) => !commonProjects.some((sourceProject) => sourceProject.id === targetProject.id)
  );

  const addableSourceProjects = sourceProjects.filter(
    (sourceProject) => !commonProjects.some((targetProject) => targetProject.id === sourceProject.id)
  );

  return (
    <>
      <Typography variant="h3" sx={{ display: { xs: 'block', md: 'none' } }}>
        {isOnImportPage() ? t('basic_data.central_import.import_candidate') : t('unpublished_result')}
      </Typography>

      <Typography variant="h4">{t('registration.description.project_association')}</Typography>
      <Typography variant="h4" sx={{ gridColumn: 3 }}>
        {t('registration.description.project_association')}
      </Typography>

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
    </>
  );
};
