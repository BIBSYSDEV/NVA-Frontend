import WarningIcon from '@mui/icons-material/Warning';
import { Typography } from '@mui/material';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { JournalType, PublicationType } from '../../types/publicationFieldNames';
import { JournalRegistration } from '../../types/publication_types/journalRegistration.types';
import { Registration } from '../../types/registration.types';
import { getMainRegistrationType } from '../../utils/registration-helpers';
import { StyledInfoBanner } from '../styled/Wrappers';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { CompareFields } from './fields/CompareFields';
import { CompareJournalFields } from './fields/CompareJournalFields';
import { SourceValue } from './fields/SourceValue';

export const MergeResultsWizardCategoryTab = () => {
  const { t } = useTranslation();
  const { control, formState, setValue } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);

  const sourceInstanceType = sourceResult.entityDescription?.reference?.publicationInstance?.type ?? '';
  const sourceMainType = getMainRegistrationType(sourceInstanceType);

  const targetInstanceType = useWatch({ name: 'entityDescription.reference.publicationInstance.type', control }) ?? '';
  const targetMainType = getMainRegistrationType(targetInstanceType);
  const targetInitialInstanceType =
    formState.defaultValues?.entityDescription?.reference?.publicationInstance?.type ?? '';

  const isSameMainCategory = sourceMainType === targetMainType;

  const hasJournalFields =
    sourceMainType === PublicationType.PublicationInJournal &&
    targetMainType === PublicationType.PublicationInJournal &&
    sourceInstanceType !== JournalType.Corrigendum &&
    targetInstanceType !== JournalType.Corrigendum;

  return (
    <>
      {!isSameMainCategory && (
        <StyledInfoBanner sx={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <WarningIcon />
          <div>
            <Trans
              i18nKey="cannot_copy_category_from_another_context_type"
              components={{ p: <Typography color="inherit" /> }}
            />
          </div>
        </StyledInfoBanner>
      )}

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
        isChanged={targetInitialInstanceType !== targetInstanceType}
        onCopyValue={
          sourceInstanceType && isSameMainCategory
            ? () => setValue('entityDescription.reference.publicationInstance.type', sourceInstanceType)
            : undefined
        }
        onResetValue={() => setValue('entityDescription.reference.publicationInstance.type', targetInitialInstanceType)}
      />

      {hasJournalFields && <CompareJournalFields sourceResult={sourceResult as JournalRegistration} />}
    </>
  );
};
