import deepmerge from 'deepmerge';
import { FormikErrors, FormikTouched, getIn, validateYupSchema, yupToFormErrors } from 'formik';
import {
  AssociatedArtifact,
  AssociatedFile,
  AssociatedLink,
  FileType,
  NullAssociatedArtifact,
} from '../../types/associatedArtifact.types';
import { Contributor } from '../../types/contributor.types';
import { HighestTouchedTab } from '../../types/locationState.types';
import { ArtisticPublicationInstance } from '../../types/publication_types/artisticRegistration.types';
import { ExhibitionRegistration } from '../../types/publication_types/exhibitionContent.types';
import { MapRegistration } from '../../types/publication_types/otherRegistration.types';
import {
  ContributorFieldNames,
  DescriptionFieldNames,
  FileFieldNames,
  PublicationType,
  ResourceFieldNames,
  SpecificContributorFieldNames,
  SpecificFileFieldNames,
  SpecificFundingFieldNames,
  SpecificLinkFieldNames,
} from '../../types/publicationFieldNames';
import { Funding, Registration, RegistrationTab } from '../../types/registration.types';
import { associatedArtifactIsFile, associatedArtifactIsLink, getMainRegistrationType } from '../registration-helpers';
import { registrationValidationSchema } from '../validation/registration/registrationValidation';

export interface TabErrors {
  [RegistrationTab.Description]: string[];
  [RegistrationTab.ResourceType]: string[];
  [RegistrationTab.Contributors]: string[];
  [RegistrationTab.FilesAndLicenses]: string[];
}

export const getErrorMessages = <T>(fieldNames: string[], errors: FormikErrors<T>, touched?: FormikTouched<T>) => {
  if (!Object.keys(errors).length || !fieldNames.length) {
    return [];
  }

  const errorFieldNames = fieldNames.filter((fieldName) => {
    const fieldHasError = !!getIn(errors, fieldName);
    const fieldIsTouched = touched === undefined || !!getIn(touched, fieldName); // Ignore touched if not included as argument
    return fieldHasError && fieldIsTouched;
  });

  const errorMessages = errorFieldNames.map((errorFieldName) => getIn(errors, errorFieldName));
  // Keep only messages with type string, since they cannot be displayed properly otherwise
  const filteredErrorMessages = errorMessages.filter((errorMessage) => typeof errorMessage === 'string');
  return [...new Set(filteredErrorMessages)];
};

export const getTabErrors = (
  values: Registration,
  errors: FormikErrors<Registration>,
  touched?: FormikTouched<Registration>
) => {
  const tabErrors: TabErrors = {
    [RegistrationTab.Description]: getErrorMessages(getAllDescriptionFields(values.fundings), errors, touched),
    [RegistrationTab.ResourceType]: getErrorMessages(resourceFieldNames, errors, touched),
    [RegistrationTab.Contributors]: getErrorMessages(
      getAllContributorFields(values.entityDescription?.contributors ?? []),
      errors,
      touched
    ),
    [RegistrationTab.FilesAndLicenses]: getErrorMessages(getAllFileFields(values.associatedArtifacts), errors, touched),
  };

  return tabErrors;
};

export const getFirstErrorTab = (tabErrors: TabErrors | null) =>
  tabErrors
    ? tabErrors[RegistrationTab.Description].length > 0
      ? RegistrationTab.Description
      : tabErrors[RegistrationTab.ResourceType].length > 0
        ? RegistrationTab.ResourceType
        : tabErrors[RegistrationTab.Contributors].length > 0
          ? RegistrationTab.Contributors
          : tabErrors[RegistrationTab.FilesAndLicenses].length > 0
            ? RegistrationTab.FilesAndLicenses
            : -1
    : -1;

const resourceFieldNames = Object.values(ResourceFieldNames);

const getAllDescriptionFields = (fundings: Funding[]) => {
  const descriptionFieldNames: string[] = Object.values(DescriptionFieldNames);
  fundings.forEach((_, index) => {
    const baseFieldName = `${DescriptionFieldNames.Fundings}[${index}]`;
    descriptionFieldNames.push(`${baseFieldName}.${SpecificFundingFieldNames.Source}`);
    descriptionFieldNames.push(`${baseFieldName}.${SpecificFundingFieldNames.Id}`);
    descriptionFieldNames.push(`${baseFieldName}.${SpecificFundingFieldNames.Identifier}`);
    descriptionFieldNames.push(`${baseFieldName}.${SpecificFundingFieldNames.NorwegianLabel}`);
    descriptionFieldNames.push(`${baseFieldName}.${SpecificFundingFieldNames.Currency}`);
    descriptionFieldNames.push(`${baseFieldName}.${SpecificFundingFieldNames.Amount}`);
  });
  return descriptionFieldNames;
};

const getAllFileFields = (associatedArtifacts: AssociatedArtifact[]): string[] => {
  const fieldNames: string[] = [];
  if (associatedArtifacts.length === 0) {
    fieldNames.push(FileFieldNames.AssociatedArtifacts);
  } else {
    associatedArtifacts.forEach((artifact, index) => {
      const baseFieldName = `${FileFieldNames.AssociatedArtifacts}[${index}]`;
      fieldNames.push(`${baseFieldName}.type`);

      if (associatedArtifactIsFile(artifact)) {
        const file = artifact as AssociatedFile;
        if (file.type !== FileType.UnpublishableFile) {
          fieldNames.push(`${baseFieldName}.${SpecificFileFieldNames.PublisherVersion}`);
          fieldNames.push(`${baseFieldName}.${SpecificFileFieldNames.EmbargoDate}`);
          fieldNames.push(`${baseFieldName}.${SpecificFileFieldNames.License}`);
        }
      } else if (associatedArtifactIsLink(artifact)) {
        fieldNames.push(`${baseFieldName}.${SpecificLinkFieldNames.Id}`);
      }
    });
  }
  return fieldNames;
};

const getAllContributorFields = (contributors: Contributor[]): string[] => {
  const fieldNames: string[] = [ContributorFieldNames.Contributors];

  contributors.forEach((_, index) => {
    const baseFieldName = `${ContributorFieldNames.Contributors}[${index}]`;
    fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.Sequence}`);
    fieldNames.push(`${baseFieldName}.${SpecificContributorFieldNames.Corresponding}`);
  });
  return fieldNames;
};

const touchedDescriptionTabFields = (fundings: Funding[]): FormikTouched<unknown> => ({
  entityDescription: {
    abstract: true,
    publicationDate: {
      day: true,
      month: true,
      year: true,
    },
    description: true,
    language: true,
    mainTitle: true,
    tags: true,
  },
  fundings: fundings.map(() => ({
    source: true,
    id: true,
    identifier: true,
    labels: { nb: true },
    fundingAmount: {
      currency: true,
      amount: true,
    },
  })),
});

const touchedResourceTabFields = (registration: Registration): FormikTouched<unknown> => {
  const mainType = getMainRegistrationType(registration.entityDescription?.reference?.publicationInstance?.type ?? '');

  switch (mainType) {
    case PublicationType.PublicationInJournal:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              id: true,
            },
            publicationInstance: {
              type: true,
              articleNumber: true,
              issue: true,
              pages: {
                begin: true,
                end: true,
              },
              volume: true,
              corrigendumFor: true,
            },
          },
        },
      };
    case PublicationType.Degree:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              publisher: { id: true },
              series: { id: true },
            },
            publicationInstance: {
              type: true,
            },
          },
        },
      };
    case PublicationType.Report:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              publisher: { id: true },
              series: { id: true },
              isbnList: [true],
            },
            publicationInstance: {
              type: true,
            },
          },
        },
      };
    case PublicationType.Book:
      return {
        entityDescription: {
          npiSubjectHeading: true,
          reference: {
            publicationContext: {
              type: true,
              publisher: { id: true },
              series: { id: true },
              isbnList: [true],
            },
            publicationInstance: {
              type: true,
              pages: {
                pages: true,
              },
            },
          },
        },
      };
    case PublicationType.Anthology:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              id: true,
            },
            publicationInstance: {
              type: true,
            },
          },
        },
      };
    case PublicationType.Presentation:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              label: true,
              agent: {
                name: true,
              },
              place: {
                label: true,
                country: true,
              },
              time: {
                from: true,
                to: true,
              },
            },
            publicationInstance: {
              type: true,
            },
          },
        },
      };
    case PublicationType.Artistic: {
      const artisticPublicationInstance = registration.entityDescription?.reference
        ?.publicationInstance as ArtisticPublicationInstance;
      const venues = (artisticPublicationInstance.venues ?? []).map(() => ({
        name: true,
        time: { from: true, to: true },
      }));

      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
            },
            publicationInstance: {
              type: true,
              subtype: { type: true, description: true },
              description: true,
              venues,
              architectureOutput: [],
              outputs: [],
              manifestations: [],
            },
          },
        },
      };
    }
    case PublicationType.MediaContribution: {
      const touchedMediaContribution = {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              id: true,
              format: true,
              medium: { type: true },
              disseminationChannel: true,
              partOf: {
                seriesName: true,
                seriesPart: true,
              },
            },
            publicationInstance: {
              type: true,
              articleNumber: true,
              issue: true,
              pages: {
                begin: true,
                end: true,
              },
              volume: true,
            },
          },
        },
      };
      return touchedMediaContribution;
    }
    case PublicationType.ResearchData: {
      const touchedResearchData = {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              publisher: { id: true },
            },
            publicationInstance: {
              type: true,
              userAgreesToTermsAndConditions: true,
              geographicalCoverage: true,
              compliesWith: [],
              referencedBy: [],
              related: [],
            },
          },
        },
      };
      return touchedResearchData;
    }
    case PublicationType.GeographicalContent: {
      const touchedMap: FormikTouched<MapRegistration> = {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
              publisher: { id: true },
            },
            publicationInstance: {
              type: true,
            },
          },
        },
      };
      return touchedMap;
    }
    case PublicationType.ExhibitionContent: {
      const touchedExhibition: FormikTouched<ExhibitionRegistration> = {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
            },
            publicationInstance: {
              type: true,
              subtype: { type: true, description: true },
              manifestations: [],
            },
          },
        },
      };
      return touchedExhibition;
    }
    default:
      return {
        entityDescription: {
          reference: {
            publicationContext: {
              type: true,
            },
            publicationInstance: {
              type: true,
            },
          },
        },
      };
  }
};

const touchedContributorTabFields = (contributors: Contributor[]): FormikTouched<unknown> => ({
  entityDescription: {
    contributors: contributors.map(() => ({
      correspondingAuthor: true,
      sequence: true,
    })),
  },
});

const touchedFilesTabFields = (associatedArtifacts: AssociatedArtifact[]): FormikTouched<Registration> => ({
  associatedArtifacts: associatedArtifacts.map((artifact) => {
    if (associatedArtifactIsFile(artifact)) {
      const touched: FormikTouched<AssociatedFile> = {
        publisherVersion: true,
        embargoDate: true,
        license: true,
      };
      return touched;
    } else if (associatedArtifactIsLink(artifact)) {
      const touched: FormikTouched<AssociatedLink> = { id: true };
      return touched;
    } else {
      const touched: FormikTouched<NullAssociatedArtifact> = { type: true };
      return touched;
    }
  }),
});

export const getTouchedTabFields = (
  tabToTouch: HighestTouchedTab,
  values: Registration
): FormikTouched<Registration> => {
  const tabFields = {
    [RegistrationTab.Description]: () => touchedDescriptionTabFields(values.fundings),
    [RegistrationTab.ResourceType]: () => touchedResourceTabFields(values),
    [RegistrationTab.Contributors]: () => touchedContributorTabFields(values.entityDescription?.contributors ?? []),
    [RegistrationTab.FilesAndLicenses]: () => touchedFilesTabFields(values.associatedArtifacts),
  };

  // Set all fields on previous tabs to touched
  const fieldsToTouchOnMount = [];
  for (let thisTab = RegistrationTab.Description; thisTab <= tabToTouch; thisTab++) {
    fieldsToTouchOnMount.push(tabFields[thisTab]());
  }
  const mergedFields = deepmerge.all(fieldsToTouchOnMount);
  return mergedFields;
};

export const validateRegistrationForm = (registration: Registration): FormikErrors<Registration> => {
  const publicationInstance = registration.entityDescription?.reference?.publicationInstance;

  try {
    validateYupSchema<Registration>(registration, registrationValidationSchema, true, {
      publicationInstanceType: publicationInstance?.type ?? '',
      publicationStatus: registration?.status,
    });
  } catch (err) {
    return yupToFormErrors(err);
  }
  return {};
};
