import * as Yup from 'yup';
import { Contributor, ContributorRole } from '../../../types/contributor.types';
import { BookType, PublicationType } from '../../../types/publicationFieldNames';
import { ErrorMessage } from '../errorMessage';

const contributorValidationSchema = Yup.object().shape({
  correspondingAuthor: Yup.boolean(),
  sequence: Yup.number(),
  role: Yup.string(),
  email: Yup.string().when('correspondingAuthor', {
    is: true,
    then: Yup.string().email(ErrorMessage.INVALID_FORMAT).required(ErrorMessage.REQUIRED),
  }),
});

export const contributorsValidationSchema = Yup.array().when(
  ['$publicationContextType', '$publicationInstanceType'],
  (publicationContextType: any, publicationInstanceType: any) => {
    if (publicationContextType === PublicationType.DEGREE) {
      return Yup.array()
        .of(contributorValidationSchema)
        .test('author-test', ErrorMessage.MISSING_AUTHOR, (contributors) =>
          hasRole(contributors, ContributorRole.CREATOR)
        )
        .test('supervisor-test', ErrorMessage.MISSING_SUPERVISOR, (contributors) =>
          hasRole(contributors, ContributorRole.SUPERVISOR)
        );
    } else if (publicationInstanceType === BookType.ANTHOLOGY) {
      return Yup.array()
        .of(contributorValidationSchema)
        .test('editor-test', ErrorMessage.MISSING_EDITOR, (contributors) =>
          hasRole(contributors, ContributorRole.EDITOR)
        );
    } else {
      return Yup.array()
        .of(contributorValidationSchema)
        .test('author-test', ErrorMessage.MISSING_AUTHOR, (contributors) =>
          hasRole(contributors, ContributorRole.CREATOR)
        );
    }
  }
);

const hasRole = (contributors: any, role: ContributorRole) =>
  !!contributors && contributors.some((contributor: Contributor) => contributor.role === role);
