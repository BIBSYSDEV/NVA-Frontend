import { TextField } from '@mui/material';
import { useContext } from 'react';
import { useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAutoResizeTextFieldMultiline } from '../../utils/hooks/useAutoResizeTextFieldMultiline';
import { CompareFields } from './CompareFields';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardDescriptionTab = () => {
  const { t } = useTranslation();
  const { sourceResult, formMethods } = useContext(MergeResultsWizardContext);

  const mainTitleValue = useWatch({ name: 'entityDescription.mainTitle', control: formMethods.control });
  const [mainTitleRef, resizeMainTitle] = useAutoResizeTextFieldMultiline();

  return (
    <>
      <CompareFields
        sourceContent={
          <TextField
            variant="filled"
            label={t('common.title')}
            multiline
            value={sourceResult.entityDescription?.mainTitle}
            disabled
          />
        }
        targetContent={
          <TextField
            variant="filled"
            label={t('common.title')}
            multiline
            inputRef={mainTitleRef}
            {...formMethods.register('entityDescription.mainTitle')}
          />
        }
        isMatching={sourceResult.entityDescription?.mainTitle === mainTitleValue}
        isChanged={mainTitleValue !== formMethods.formState.defaultValues?.entityDescription?.mainTitle}
        onCopyValue={() => {
          formMethods.setValue('entityDescription.mainTitle', sourceResult.entityDescription?.mainTitle ?? '');
          resizeMainTitle();
        }}
        onResetValue={() => {
          formMethods.resetField('entityDescription.mainTitle');
          resizeMainTitle();
        }}
      />
    </>
  );
};
