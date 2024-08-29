import { FormikErrors, FormikTouched } from 'formik';
import { CristinProject, ProjectTabs } from '../../types/project.types';
import {
  ProjectContributorsFieldNames,
  ProjectDescriptionFieldNames,
  ProjectDetailsFieldNames,
} from '../projectFormikFieldNames';
import { getErrorMessages } from './formik-helpers';

interface ProjectTabErrors {
  [ProjectTabs.Description]: string[];
  [ProjectTabs.Details]: string[];
  [ProjectTabs.Contributors]: string[];
}

export const hasErrors = (errors: FormikErrors<CristinProject>, touched?: FormikTouched<CristinProject>) => {
  const tabErrors = getProjectTabErrors(errors, touched);
  return Object.values(tabErrors).some((arr) => arr.length > 0);
};

export const getProjectTabErrors = (errors: FormikErrors<CristinProject>, touched?: FormikTouched<CristinProject>) => {
  const tabErrors: ProjectTabErrors = {
    [ProjectTabs.Description]: getErrorMessages<CristinProject>(
      Object.values(ProjectDescriptionFieldNames),
      errors,
      touched
    ),
    [ProjectTabs.Details]: getErrorMessages<CristinProject>(Object.values(ProjectDetailsFieldNames), errors, touched),
    [ProjectTabs.Contributors]: getErrorMessages<CristinProject>(Object.values(ProjectContributorsFieldNames), errors),
  };

  return tabErrors;
};
