import { FormikErrors, FormikTouched } from 'formik';
import { CristinProject, ProjectTabs } from '../../types/project.types';
import { ProjectDescriptionFieldNames, ProjectDetailsFieldNames } from '../projectFormikFieldNames';
import { getErrorMessages } from './formik-helpers';

interface ProjectTabErrors {
  [ProjectTabs.Description]: string[];
  [ProjectTabs.Details]: string[];
}

export const getProjectTabErrors = (errors: FormikErrors<CristinProject>, touched?: FormikTouched<CristinProject>) => {
  const tabErrors: ProjectTabErrors = {
    [ProjectTabs.Description]: getErrorMessages<CristinProject>(
      Object.values(ProjectDescriptionFieldNames),
      errors,
      touched
    ),
    [ProjectTabs.Details]: getErrorMessages<CristinProject>(Object.values(ProjectDetailsFieldNames), errors, touched),
  };

  return tabErrors;
};
