import * as Yup from 'yup';
import { Contributor, ContributorRole } from '../../../types/contributor.types';
import { BookType, PublicationType } from '../../../types/publicationFieldNames';
import { ErrorMessage } from '../errorMessage';

const contributorValidationSchema = Yup.object().shape({
  correspondingAuthor: Yup.boolean(),
});

export const contributorsValidationSchema = Yup.array()
  .when('$publicationInstanceType', {
    is: BookType.ANTHOLOGY,
    then: Yup.array()
      .of(contributorValidationSchema)
      .test('editor-test', ErrorMessage.MISSING_EDITOR, (contributors) =>
        hasRole(contributors, ContributorRole.EDITOR)
      ),
    otherwise: Yup.array()
      .of(contributorValidationSchema)
      .test('author-test', ErrorMessage.MISSING_AUTHOR, (contributors) =>
        hasRole(contributors, ContributorRole.CREATOR)
      ),
  })
  .when('$publicationContextType', {
    is: PublicationType.DEGREE,
    then: Yup.array()
      .of(contributorValidationSchema)
      .test('supervisor-test', ErrorMessage.MISSING_SUPERVISOR, (contributors) =>
        hasRole(contributors, ContributorRole.SUPERVISOR)
      )
      .test('author-test', ErrorMessage.MISSING_AUTHOR, (contributors) =>
        hasRole(contributors, ContributorRole.CREATOR)
      ),
  });

const hasRole = (contributors: any, role: ContributorRole) =>
  !!contributors && contributors.some((contributor: Contributor) => contributor.role === role);
