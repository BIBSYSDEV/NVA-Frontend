import { useFormikContext } from 'formik';
import React from 'react';
import { BookType } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { ContributorAuthors } from './contributors_tab/components/ContributorAuthors';
import { ContributorEditors } from './contributors_tab/components/ContributorEditors';

const ContributorsPanel = () => {
  const {
    values: {
      entityDescription: {
        reference: { publicationInstance },
      },
    },
  } = useFormikContext<Registration>();

  return <>{publicationInstance.type !== BookType.ANTHOLOGY ? <ContributorAuthors /> : <ContributorEditors />}</>;
};

export default ContributorsPanel;
