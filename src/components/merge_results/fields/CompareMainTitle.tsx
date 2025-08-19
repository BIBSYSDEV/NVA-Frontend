import { TextField } from '@mui/material';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../../types/registration.types';
import { useAutoResizeTextFieldMultiline } from '../../../utils/hooks/useAutoResizeTextFieldMultiline';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { CompareFields } from './CompareFields';

export const CompareMainTitle = () => {
  const { t } = useTranslation();
  const { control, formState, register, setValue, resetField } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);

  const mainTitleValue = useWatch({ name: 'entityDescription.mainTitle', control });
  const [mainTitleRef, resizeMainTitle] = useAutoResizeTextFieldMultiline();

  return (
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
          {...register('entityDescription.mainTitle')}
        />
      }
      isMatching={sourceResult.entityDescription?.mainTitle === mainTitleValue}
      isChanged={mainTitleValue !== formState.defaultValues?.entityDescription?.mainTitle}
      onCopyValue={() => {
        setValue('entityDescription.mainTitle', sourceResult.entityDescription?.mainTitle ?? '');
        resizeMainTitle();
      }}
      onResetValue={() => {
        resetField('entityDescription.mainTitle');
        resizeMainTitle();
      }}
    />
  );
};
