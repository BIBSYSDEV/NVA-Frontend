import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { JournalType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { NviValidation } from '../components/NviValidation';
import { SearchContainerField } from '../components/SearchContainerField';
import { JournalRegistration } from '../../../../types/publication_types/journalRegistration.types';
import { JournalField } from '../components/JournalField';
import { dataTestId } from '../../../../utils/dataTestIds';
import { InputContainerBox } from '../../../../components/styled/Wrappers';
import { PublicationChannelType } from '../../../../types/registration.types';
import { JournalDetailsFields } from '../components/JournalDetailsFields';

export const JournalForm = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<JournalRegistration>();
  const instanceType = values.entityDescription.reference?.publicationInstance.type;

  return (
    <>
      <InputContainerBox>
        {instanceType === JournalType.Corrigendum ? (
          <SearchContainerField
            fieldName={ResourceFieldNames.CorrigendumFor}
            searchSubtypes={[JournalType.AcademicArticle]}
            label={t('registration.resource_type.original_article_title')}
            placeholder={t('registration.resource_type.search_for_original_article')}
            dataTestId={dataTestId.registrationWizard.resourceType.corrigendumForField}
            fetchErrorMessage={t('feedback.error.get_journal_article')}
          />
        ) : (
          <JournalField
            confirmedContextType={PublicationChannelType.Journal}
            unconfirmedContextType={PublicationChannelType.UnconfirmedJournal}
          />
        )}

        <JournalDetailsFields />
      </InputContainerBox>

      <NviValidation registration={values} />
    </>
  );
};
