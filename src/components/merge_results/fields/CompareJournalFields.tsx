import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { JournalRegistration } from '../../../types/publication_types/journalRegistration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { CompareTextField } from './CompareTextField';

interface CompareJournalFieldsProps {
  sourceResult: JournalRegistration;
}

export const CompareJournalFields = ({ sourceResult }: CompareJournalFieldsProps) => {
  const { t } = useTranslation();
  const { formState } = useFormContext<JournalRegistration>();
  const originalPublicationInstance = formState.defaultValues?.entityDescription?.reference?.publicationInstance;

  return (
    <>
      <CompareTextField
        label={t('registration.resource_type.volume')}
        sourceValue={sourceResult.entityDescription.reference?.publicationInstance.volume}
        originalTargetValue={originalPublicationInstance?.volume}
        fieldName="entityDescription.reference.publicationInstance.volume"
        dataTestId={dataTestId.registrationWizard.resourceType.volumeField}
      />

      <CompareTextField
        label={t('registration.resource_type.issue')}
        sourceValue={sourceResult.entityDescription.reference?.publicationInstance.issue}
        originalTargetValue={originalPublicationInstance?.issue}
        fieldName="entityDescription.reference.publicationInstance.issue"
        dataTestId={dataTestId.registrationWizard.resourceType.issueField}
      />

      <CompareTextField
        label={t('registration.resource_type.pages_from')}
        sourceValue={sourceResult.entityDescription.reference?.publicationInstance.pages?.begin}
        originalTargetValue={originalPublicationInstance?.pages?.begin}
        fieldName="entityDescription.reference.publicationInstance.pages.begin"
        dataTestId={dataTestId.registrationWizard.resourceType.pagesFromField}
      />

      <CompareTextField
        label={t('basic_data.central_import.merge_candidate.page_to')}
        sourceValue={sourceResult.entityDescription.reference?.publicationInstance.pages?.end}
        originalTargetValue={originalPublicationInstance?.pages?.end}
        fieldName="entityDescription.reference.publicationInstance.pages.end"
        dataTestId={dataTestId.registrationWizard.resourceType.pagesToField}
      />
    </>
  );
};
