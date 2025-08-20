import { TextField } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { JournalRegistration } from '../../../types/publication_types/journalRegistration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { CompareFields } from './CompareFields';
import { SourceValue } from './SourceValue';

interface CompareJournalFieldsProps {
  sourceResult: JournalRegistration;
}

export const CompareJournalFields = ({ sourceResult }: CompareJournalFieldsProps) => {
  const { t } = useTranslation();
  const { control, formState, register, setValue, resetField } = useFormContext<JournalRegistration>();

  const sourceVolume = sourceResult.entityDescription.reference?.publicationInstance.volume ?? '';
  const targetVolume = useWatch({ name: 'entityDescription.reference.publicationInstance.volume', control }) ?? '';

  const sourceIssue = sourceResult.entityDescription.reference?.publicationInstance.issue ?? '';
  const targetIssue = useWatch({ name: 'entityDescription.reference.publicationInstance.issue', control }) ?? '';

  const sourcePagesFrom = sourceResult.entityDescription.reference?.publicationInstance.pages?.begin ?? '';
  const targetPagesFrom =
    useWatch({ name: 'entityDescription.reference.publicationInstance.pages.begin', control }) ?? '';

  const sourcePagesTo = sourceResult.entityDescription.reference?.publicationInstance.pages?.end ?? '';
  const targetPagesTo = useWatch({ name: 'entityDescription.reference.publicationInstance.pages.end', control }) ?? '';

  return (
    <>
      <CompareFields
        sourceContent={
          <SourceValue
            label={t('registration.resource_type.volume')}
            value={sourceResult.entityDescription.reference?.publicationInstance.volume}
          />
        }
        targetContent={
          <TextField
            data-testid={dataTestId.registrationWizard.resourceType.volumeField}
            variant="filled"
            label={t('registration.resource_type.volume')}
            {...register('entityDescription.reference.publicationInstance.volume')}
          />
        }
        isMatching={sourceVolume === targetVolume}
        isChanged={
          targetVolume !== (formState.defaultValues?.entityDescription?.reference?.publicationInstance?.volume ?? '')
        }
        onCopyValue={
          sourceResult.entityDescription.reference?.publicationInstance.volume
            ? () => setValue('entityDescription.reference.publicationInstance.volume', sourceVolume)
            : undefined
        }
        onResetValue={() => resetField('entityDescription.reference.publicationInstance.volume')}
      />

      <CompareFields
        sourceContent={
          <SourceValue
            label={t('registration.resource_type.issue')}
            value={sourceResult.entityDescription.reference?.publicationInstance.issue}
          />
        }
        targetContent={
          <TextField
            data-testid={dataTestId.registrationWizard.resourceType.issueField}
            variant="filled"
            label={t('registration.resource_type.issue')}
            {...register('entityDescription.reference.publicationInstance.issue')}
          />
        }
        isMatching={sourceIssue === targetIssue}
        isChanged={
          targetIssue !== (formState.defaultValues?.entityDescription?.reference?.publicationInstance?.issue ?? '')
        }
        onCopyValue={
          sourceResult.entityDescription.reference?.publicationInstance.issue
            ? () => setValue('entityDescription.reference.publicationInstance.issue', sourceIssue)
            : undefined
        }
        onResetValue={() => resetField('entityDescription.reference.publicationInstance.issue')}
      />

      <CompareFields
        sourceContent={
          <SourceValue
            label={t('registration.resource_type.pages_from')}
            value={sourceResult.entityDescription.reference?.publicationInstance.pages?.begin}
          />
        }
        targetContent={
          <TextField
            data-testid={dataTestId.registrationWizard.resourceType.pagesFromField}
            variant="filled"
            label={t('registration.resource_type.pages_from')}
            {...register('entityDescription.reference.publicationInstance.pages.begin')}
          />
        }
        isMatching={sourcePagesFrom === targetPagesFrom}
        isChanged={
          targetPagesFrom !==
          (formState.defaultValues?.entityDescription?.reference?.publicationInstance?.pages?.begin ?? '')
        }
        onCopyValue={
          sourceResult.entityDescription.reference?.publicationInstance.pages?.begin
            ? () => setValue('entityDescription.reference.publicationInstance.pages.begin', sourcePagesFrom)
            : undefined
        }
        onResetValue={() => resetField('entityDescription.reference.publicationInstance.pages.begin')}
      />
      <CompareFields
        sourceContent={
          <SourceValue
            label={t('registration.resource_type.pages_to')}
            value={sourceResult.entityDescription.reference?.publicationInstance.pages?.end}
          />
        }
        targetContent={
          <TextField
            data-testid={dataTestId.registrationWizard.resourceType.pagesToField}
            variant="filled"
            label={t('registration.resource_type.pages_to')}
            {...register('entityDescription.reference.publicationInstance.pages.end')}
          />
        }
        isMatching={sourcePagesTo === targetPagesTo}
        isChanged={
          targetPagesTo !==
          (formState.defaultValues?.entityDescription?.reference?.publicationInstance?.pages?.end ?? '')
        }
        onCopyValue={
          sourceResult.entityDescription.reference?.publicationInstance.pages?.end
            ? () => setValue('entityDescription.reference.publicationInstance.pages.end', sourcePagesTo)
            : undefined
        }
        onResetValue={() => resetField('entityDescription.reference.publicationInstance.pages.end')}
      />
    </>
  );
};
