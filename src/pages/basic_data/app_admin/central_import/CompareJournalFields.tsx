import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ImportCandidate } from '../../../../types/importCandidate.types';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { JournalRegistration } from '../../../../types/publication_types/journalRegistration.types';
import { Registration } from '../../../../types/registration.types';
import { CompareFields } from './CompareFields';

interface CompareJournalFieldsProps {
  importCandidate: ImportCandidate;
}

export const CompareJournalFields = ({ importCandidate }: CompareJournalFieldsProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<Registration>();

  const journalCandidate = importCandidate as JournalRegistration;
  const journalValues = values as JournalRegistration;

  return (
    <>
      <CompareFields
        candidateLabel={t('registration.resource_type.volume')}
        onOverwrite={() =>
          setFieldValue(
            ResourceFieldNames.Volume,
            journalCandidate.entityDescription?.reference?.publicationInstance?.volume
          )
        }
        candidateValue={journalCandidate.entityDescription?.reference?.publicationInstance?.volume ?? ''}
        registrationValue={journalValues.entityDescription?.reference?.publicationInstance?.volume ?? ''}
      />
      <CompareFields
        candidateLabel={t('registration.resource_type.issue')}
        onOverwrite={() =>
          setFieldValue(
            ResourceFieldNames.Issue,
            journalCandidate.entityDescription?.reference?.publicationInstance.issue
          )
        }
        candidateValue={journalCandidate.entityDescription?.reference?.publicationInstance.issue ?? ''}
        registrationValue={journalValues.entityDescription?.reference?.publicationInstance.issue ?? ''}
      />
      <CompareFields
        candidateLabel={t('registration.resource_type.pages_from')}
        onOverwrite={() =>
          setFieldValue(
            ResourceFieldNames.PagesFrom,
            journalCandidate.entityDescription?.reference?.publicationInstance.pages?.begin ?? ''
          )
        }
        candidateValue={journalCandidate.entityDescription?.reference?.publicationInstance.pages?.begin ?? ''}
        registrationValue={journalValues.entityDescription?.reference?.publicationInstance.pages?.begin ?? ''}
      />
      <CompareFields
        candidateLabel={t('basic_data.central_import.merge_candidate.page_to')}
        onOverwrite={() =>
          setFieldValue(
            ResourceFieldNames.PagesTo,
            journalCandidate.entityDescription?.reference?.publicationInstance.pages?.end ?? ''
          )
        }
        candidateValue={journalCandidate.entityDescription?.reference?.publicationInstance.pages?.end ?? ''}
        registrationValue={journalValues.entityDescription?.reference?.publicationInstance.pages?.end ?? ''}
      />
    </>
  );
};
