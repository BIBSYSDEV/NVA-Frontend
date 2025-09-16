import { getLanguageByUri } from 'nva-language';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LanguageCode } from '../../../layout/header/LanguageSelector';
import { LanguageSelectorField } from '../../../pages/registration/description_tab/LanguageSelectorField';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { CompareFields } from './CompareFields';
import { SourceValue } from './SourceValue';

export const CompareLanguage = () => {
  const { t, i18n } = useTranslation();
  const languageCode = i18n.language as LanguageCode;

  const { control, formState, register, setValue, resetField } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);

  const languageValue = useWatch({ name: 'entityDescription.language', control }) ?? '';
  const sourceLanguage = sourceResult.entityDescription?.language ?? '';
  const initialTargetLanguage = formState.defaultValues?.entityDescription?.language ?? '';

  return (
    <CompareFields
      sourceContent={
        <SourceValue
          label={t('registration.description.primary_language')}
          value={
            sourceResult.entityDescription?.language
              ? getLanguageByUri(sourceResult.entityDescription.language)[languageCode]
              : ''
          }
        />
      }
      targetContent={
        <LanguageSelectorField
          data-testid={dataTestId.registrationWizard.description.languageField}
          variant="filled"
          label={t('common.title')}
          multiline
          value={languageValue}
          {...register('entityDescription.language')}
        />
      }
      isMatching={sourceLanguage === languageValue}
      isChanged={languageValue !== initialTargetLanguage}
      onCopyValue={
        sourceLanguage
          ? () => {
              setValue('entityDescription.language', sourceLanguage);
            }
          : undefined
      }
      onResetValue={() => resetField('entityDescription.language')}
    />
  );
};
