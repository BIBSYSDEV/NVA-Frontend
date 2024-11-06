import * as Yup from 'yup';
import i18n from '../../../translations/i18n';
import { Contributor, ContributorRole } from '../../../types/contributor.types';
import { BookType, ReportType, ResearchDataType } from '../../../types/publicationFieldNames';
import {
  isArtistic,
  isDegree,
  isExhibitionContent,
  isMediaContribution,
  isOtherRegistration,
  isPresentation,
} from '../../registration-helpers';

const contributorErrorMessage = {
  authorOrEditorRequired: i18n.t('feedback.validation.author_or_editor_required'),
  authorRequired: i18n.t('feedback.validation.author_required'),
  contributorRequired: i18n.t('feedback.validation.contributor_required'),
  editorRequired: i18n.t('feedback.validation.editor_required'),
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
    } else if (publicationInstanceType === BookType.Textbook) {
      return Yup.array()
        .of(contributorValidationSchema)
        .test(
          'role-test',
          contributorErrorMessage.authorOrEditorRequired,
          (contributors) =>
            hasRole(contributors, ContributorRole.Editor) || hasRole(contributors, ContributorRole.Creator)
        )
        .required(contributorErrorMessage.authorOrEditorRequired);
    } else if (publicationInstanceType === ReportType.BookOfAbstracts) {
      return Yup.array().of(contributorValidationSchema);
    } else if (
      isPresentation(publicationInstanceType) ||
      isArtistic(publicationInstanceType) ||
      isMediaContribution(publicationInstanceType) ||
      isOtherRegistration(publicationInstanceType) ||
      isExhibitionContent(publicationInstanceType) ||
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
