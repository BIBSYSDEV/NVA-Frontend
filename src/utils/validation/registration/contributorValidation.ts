import * as Yup from 'yup';
import { Contributor, ContributorRole } from '../../../types/contributor.types';
import { BookType, ReportType, ResearchDataType } from '../../../types/publicationFieldNames';
import i18n from '../../../translations/i18n';
import {
  isArtistic,
  isDegree,
  isMediaContribution,
  isOtherRegistration,
  isPresentation,
} from '../../registration-helpers';

const contributorErrorMessage = {
  authorRequired: i18n.t('translation:feedback.validation.author_required'),
  contributorRequired: i18n.t('translation:feedback.validation.contributor_required'),
  editorRequired: i18n.t('translation:feedback.validation.editor_required'),
};

const contributorValidationSchema = Yup.object().shape({
  correspondingAuthor: Yup.boolean(),
  sequence: Yup.number(),
  role: Yup.object({
    type: Yup.string(),
  }),
});

export const contributorsValidationSchema = Yup.array().when(
  '$publicationInstanceType',
  ([publicationInstanceType]) => {
    if (isDegree(publicationInstanceType) || publicationInstanceType === ResearchDataType.DataManagementPlan) {
      return Yup.array()
        .of(contributorValidationSchema)
        .test('author-test', contributorErrorMessage.authorRequired, (contributors) =>
          hasRole(contributors, ContributorRole.Creator)
        )
        .required(contributorErrorMessage.authorRequired);
    } else if (publicationInstanceType === BookType.Anthology) {
      return Yup.array()
        .of(contributorValidationSchema)
        .test('editor-test', contributorErrorMessage.editorRequired, (contributors) =>
          hasRole(contributors, ContributorRole.Editor)
        )
        .required(contributorErrorMessage.editorRequired);
    } else if (publicationInstanceType === ReportType.BookOfAbstracts) {
      return Yup.array().of(contributorValidationSchema);
    } else if (
      isPresentation(publicationInstanceType) ||
      isArtistic(publicationInstanceType) ||
      isMediaContribution(publicationInstanceType) ||
      isOtherRegistration(publicationInstanceType) ||
      publicationInstanceType === ResearchDataType.Dataset
    ) {
      return Yup.array()
        .of(contributorValidationSchema)
        .min(1, contributorErrorMessage.contributorRequired)
        .required(contributorErrorMessage.contributorRequired);
    } else {
      return Yup.array()
        .of(contributorValidationSchema)
        .test('author-test', contributorErrorMessage.authorRequired, (contributors) =>
          hasRole(contributors, ContributorRole.Creator)
        )
        .required(contributorErrorMessage.authorRequired);
    }
  }
);

const hasRole = (contributors: any, role: ContributorRole) =>
  !!contributors && contributors.some((contributor: Contributor) => contributor.role.type === role);
