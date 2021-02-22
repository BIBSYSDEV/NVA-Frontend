import { useFormikContext } from 'formik';
import React from 'react';
import { ContributorRole } from '../../types/contributor.types';
import { BookType } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { Contributors } from './contributors_tab/components/Contributors';

const ContributorsPanel = () => {
  const {
    values: {
      entityDescription: {
        reference: { publicationInstance },
      },
    },
  } = useFormikContext<Registration>();

  return publicationInstance.type !== BookType.ANTHOLOGY ? (
    <Contributors />
  ) : (
    <Contributors contributorRole={ContributorRole.EDITOR} />
  );
};

export default ContributorsPanel;
