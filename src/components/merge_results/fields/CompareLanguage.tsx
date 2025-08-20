import { getLanguageByUri } from 'nva-language';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LanguageSelectorField } from '../../../pages/registration/description_tab/LanguageSelectorField';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { CompareFields } from './CompareFields';
import { SourceValue } from './SourceValue';

export const CompareLanguage = () => {
  const { t } = useTranslation();
  const { control, formState, register, setValue, resetField } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);

  const languageValue = useWatch({ name: 'entityDescription.language', control });

  return (
    <CompareFields
      sourceContent={
        <SourceValue
          label={t('registration.description.primary_language')}
          value={
            sourceResult.entityDescription?.language
              ? getLanguageByUri(sourceResult.entityDescription.language).nob // TODO: Handle more languages
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
      isMatching={sourceResult.entityDescription?.language === languageValue}
      isChanged={languageValue !== formState.defaultValues?.entityDescription?.language}
      onCopyValue={
        sourceResult.entityDescription?.language
          ? () => {
              setValue('entityDescription.language', sourceResult.entityDescription!.language);
            }
          : undefined
      }
      onResetValue={() => resetField('entityDescription.language')}
    />
  );
};
