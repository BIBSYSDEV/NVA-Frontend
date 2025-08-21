import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { JournalType, PublicationType } from '../../types/publicationFieldNames';
import { JournalRegistration } from '../../types/publication_types/journalRegistration.types';
import { Registration } from '../../types/registration.types';
import { getMainRegistrationType } from '../../utils/registration-helpers';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { CompareFields } from './fields/CompareFields';
import { CompareJournalFields } from './fields/CompareJournalFields';
import { SourceValue } from './fields/SourceValue';

export const MergeResultsWizardCategoryTab = () => {
  const { t } = useTranslation();
  const { control, resetField, formState, setValue } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);

  const sourceInstanceType = sourceResult.entityDescription?.reference?.publicationInstance?.type ?? '';
  const sourceMainType = getMainRegistrationType(sourceInstanceType);

  const targetInstanceType = useWatch({ name: 'entityDescription.reference.publicationInstance.type', control }) ?? '';

  const hasJournalFields =
    sourceMainType === PublicationType.PublicationInJournal &&
    getMainRegistrationType(targetInstanceType) === PublicationType.PublicationInJournal &&
    sourceInstanceType !== JournalType.Corrigendum &&
    targetInstanceType !== JournalType.Corrigendum;

  return (
    <>
      <CompareFields
        sourceContent={
          <SourceValue
            label={t('common.category')}
            value={sourceInstanceType ? t(`registration.publication_types.${sourceInstanceType}`) : ''}
          />
        }
        targetContent={
          <SourceValue
            label={t('common.category')}
            value={targetInstanceType ? t(`registration.publication_types.${targetInstanceType}`) : ''}
          />
        }
        isMatching={sourceInstanceType === targetInstanceType}
        isChanged={
          (formState.defaultValues?.entityDescription?.reference?.publicationInstance?.type ?? '') !==
          targetInstanceType
        }
        onCopyValue={
          sourceInstanceType
            ? () => {
                setValue('entityDescription.reference.publicationContext.type', sourceMainType);
                setValue('entityDescription.reference.publicationInstance.type', sourceInstanceType);
              }
            : undefined
        }
        onResetValue={() => resetField('entityDescription.reference')}
      />

      {hasJournalFields && <CompareJournalFields sourceResult={sourceResult as JournalRegistration} />}
    </>
  );
};
