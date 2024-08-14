import { FormikErrors, FormikTouched } from 'formik';
import { CristinProject } from '../../types/project.types';
import { RegistrationTab } from '../../types/registration.types';
import { ProjectDescriptionFieldNames } from '../projectFieldNames';
import { getErrorMessages } from './formik-helpers';

interface ProjectTabErrors {
  [RegistrationTab.Description]: string[];
}

export const getProjectTabErrors = (errors: FormikErrors<CristinProject>, touched?: FormikTouched<CristinProject>) => {
  const tabErrors: ProjectTabErrors = {
    [RegistrationTab.Description]: getErrorMessages<CristinProject>(
      Object.values(ProjectDescriptionFieldNames),
      errors,
      touched
    ),
  };

  return tabErrors;
};
