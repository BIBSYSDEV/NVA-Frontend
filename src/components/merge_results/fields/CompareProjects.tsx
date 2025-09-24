import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../../types/registration.types';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';

export const CompareProjects = () => {
  const { t } = useTranslation();

  const { control, formState } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceProjects = sourceResult.projects;

  const targetProjects = useWatch({ name: 'projects', control });
  const initialTargetProject = formState.defaultValues?.projects;

  return (
    <>
      {targetProjects.map((project) => (
        <p key={project.id}>{project.name}</p>
      ))}
    </>
  );
};
