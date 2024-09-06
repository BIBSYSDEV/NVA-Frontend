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
    [ProjectTabs.Contributors]: getErrorMessages<CristinProject>(
      Object.values(ProjectContributorsFieldNames),
      errors,
      touched
    ),
  };

  return tabErrors;
};

const mandatoryFieldsTab0 = {
  title: true,
  startDate: true,
  endDate: true,
};

const mandatoryFieldsTab1 = {
  coordinatingInstitution: { id: true },
};

const mandatoryFieldsTab2 = {
  contributors: true,
};

const mandatoryFieldsTab3 = {};

export const getTouchedFields = (tabNumber: number) => {
  console.log('tabNumber----', tabNumber);
  switch (tabNumber) {
    case 0: {
      return {};
    }
    case 1: {
      return mandatoryFieldsTab0;
    }
    case 2: {
      return { ...mandatoryFieldsTab0, ...mandatoryFieldsTab1 };
    }
    case 3: {
      return { ...mandatoryFieldsTab0, ...mandatoryFieldsTab1, ...mandatoryFieldsTab2 };
    }
    case 4: {
      return { ...mandatoryFieldsTab0, ...mandatoryFieldsTab1, ...mandatoryFieldsTab2, ...mandatoryFieldsTab3 };
    }
    default: {
      return {};
    }
  }
};
