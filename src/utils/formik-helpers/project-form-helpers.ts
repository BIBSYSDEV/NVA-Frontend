import { FormikErrors, FormikTouched } from 'formik';
import { CristinProject, ProjectFunding, ProjectTabs, SaveCristinProject } from '../../types/project.types';
import {
  FundingFieldNames,
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

const getAllDetailsFields = (funding: ProjectFunding[]): string[] => {
  const fieldNames: string[] = Object.values(ProjectDetailsFieldNames);

  funding.forEach((_, index) => {
    const baseFieldName = `${ProjectDetailsFieldNames.Funding}[${index}]`;
    fieldNames.push(`${baseFieldName}.${FundingFieldNames.Source}`);
  });

  return fieldNames;
};

export const hasErrors = (
  values: CristinProject,
  errors: FormikErrors<CristinProject>,
  touched?: FormikTouched<CristinProject>
) => {
  const tabErrors = getProjectTabErrors(values, errors, touched);
  return Object.values(tabErrors).some((arr) => arr.length > 0);
};

export const getProjectTabErrors = (
  values: CristinProject,
  errors: FormikErrors<CristinProject>,
  touched?: FormikTouched<CristinProject>
) => {
  const tabErrors: ProjectTabErrors = {
    [ProjectTabs.Description]: getErrorMessages<CristinProject>(
      Object.values(ProjectDescriptionFieldNames),
      errors,
      touched
    ),
    [ProjectTabs.Details]: getErrorMessages<CristinProject>(getAllDetailsFields(values.funding || []), errors, touched),
    [ProjectTabs.Contributors]: getErrorMessages<CristinProject>(
      Object.values(ProjectContributorsFieldNames),
      errors,
      touched
    ),
  };

  return tabErrors;
};

export const getTouchedFields = (tabNumber: number, values: SaveCristinProject) => {
  const fieldsTab0 = {
    title: true,
    startDate: true,
    endDate: true,
  };

  const fieldsTab1 = {
    coordinatingInstitution: { id: true },
    funding: values.funding.map(() => ({
      source: true,
      identifier: true,
    })),
  };

  const fieldsTab2 = {
    contributors: true,
  };

  const fieldsTab3 = {};

  switch (tabNumber) {
    case 0: {
      return {};
    }
    case 1: {
      return fieldsTab0;
    }
    case 2: {
      return { ...fieldsTab0, ...fieldsTab1 };
    }
    case 3: {
      return { ...fieldsTab0, ...fieldsTab1, ...fieldsTab2 };
    }
    case 4: {
      return { ...fieldsTab0, ...fieldsTab1, ...fieldsTab2, ...fieldsTab3 };
    }
    default: {
      return {};
    }
  }
};
