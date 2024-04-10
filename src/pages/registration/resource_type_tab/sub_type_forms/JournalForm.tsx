import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { InputContainerBox } from '../../../../components/styled/Wrappers';
import { JournalRegistration } from '../../../../types/publication_types/journalRegistration.types';
import { JournalType, ResourceFieldNames } from '../../../../types/publicationFieldNames';
import { PublicationChannelType } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { nviApplicableTypes } from '../../../../utils/registration-helpers';
import { JournalDetailsFields } from '../components/JournalDetailsFields';
import { JournalField } from '../components/JournalField';
import { NviValidation } from '../components/NviValidation';
import { SearchContainerField } from '../components/SearchContainerField';

const journalArticleTypes = [
  JournalType.AcademicArticle,
  JournalType.AcademicLiteratureReview,
  JournalType.CaseReport,
  JournalType.StudyProtocol,
  JournalType.ProfessionalArticle,
  JournalType.PopularScienceArticle,
];

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
            searchSubtypes={journalArticleTypes}
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

      {instanceType && nviApplicableTypes.includes(instanceType) ? (
        <NviValidation registration={values} />
      ) : null}
    </>
  );
};
