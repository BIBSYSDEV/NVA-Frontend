import { FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { JournalPublication } from '../../../../types/publication.types';
import { JournalEntityDescription } from '../../../../types/publication_types/journalPublication.types';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import PeerReview from '../components/PeerReview';
import NviValidation from '../components/NviValidation';
import JournalForm from './JournalForm';

const JournalArticleForm: FC = () => {
  const { t } = useTranslation('publication');
  const { values }: FormikProps<JournalPublication> = useFormikContext();
  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription as JournalEntityDescription;

  return (
    <>
      <JournalForm />

      <PeerReview fieldName={ReferenceFieldNames.PEER_REVIEW} label={t('references.peer_review')} />

      <NviValidation
        isPeerReviewed={publicationInstance.peerReviewed}
        isRated={!!publicationContext?.level}
        dataTestId="nvi_journal"
      />
    </>
  );
};

export default JournalArticleForm;
