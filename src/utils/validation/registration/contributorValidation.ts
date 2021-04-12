import * as Yup from 'yup';
import { Contributor, ContributorRole } from '../../../types/contributor.types';
import { BookType, PublicationType } from '../../../types/publicationFieldNames';
import i18n from '../../../translations/i18n';

const contributorErrorMessage = {
  authorRequired: i18n.t('feedback:validation.author_required'),
  editorRequired: i18n.t('feedback:validation.editor_required'),
  supervisorRequired: i18n.t('feedback:validation.supervisor_required'),
};

const contributorValidationSchema = Yup.object().shape({
  correspondingAuthor: Yup.boolean(),
  sequence: Yup.number(),
  role: Yup.string(),
});

export const contributorsValidationSchema = Yup.array().when(
  ['$publicationContextType', '$publicationInstanceType'],
  (publicationContextType: any, publicationInstanceType: any) => {
    if (publicationContextType === PublicationType.DEGREE) {
      return Yup.array()
        .of(contributorValidationSchema)
        .test('author-test', contributorErrorMessage.authorRequired, (contributors) =>
          hasRole(contributors, ContributorRole.CREATOR)
        )
        .test('supervisor-test', contributorErrorMessage.supervisorRequired, (contributors) =>
          hasRole(contributors, ContributorRole.SUPERVISOR)
        );
    } else if (publicationInstanceType === BookType.ANTHOLOGY) {
      return Yup.array()
        .of(contributorValidationSchema)
        .test('editor-test', contributorErrorMessage.editorRequired, (contributors) =>
          hasRole(contributors, ContributorRole.EDITOR)
        );
    } else {
      return Yup.array()
        .of(contributorValidationSchema)
        .test('author-test', contributorErrorMessage.authorRequired, (contributors) =>
          hasRole(contributors, ContributorRole.CREATOR)
        );
    }
  }
);

const hasRole = (contributors: any, role: ContributorRole) =>
  !!contributors && contributors.some((contributor: Contributor) => contributor.role === role);
