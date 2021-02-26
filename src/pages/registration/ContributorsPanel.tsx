import { useFormikContext } from 'formik';
import React from 'react';
import { ContributorRole } from '../../types/contributor.types';
import { BookType, PublicationType } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { Contributors } from './contributors_tab/components/Contributors';

const ContributorsPanel = () => {
  const {
    values: {
      entityDescription: {
        reference: { publicationContext, publicationInstance },
        contributors,
      },
    },
  } = useFormikContext<Registration>();

  console.log(contributors);
  return publicationContext.type === PublicationType.DEGREE ? (
    <>
      <Contributors />
      <Contributors contributorRole={ContributorRole.SUPERVISOR} />
    </>
  ) : publicationInstance.type === BookType.ANTHOLOGY ? (
    <Contributors contributorRole={ContributorRole.EDITOR} />
  ) : (
    <Contributors />
  );
};

export default ContributorsPanel;
