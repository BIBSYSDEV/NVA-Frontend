import { TextField } from '@mui/material';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useAutoResizeTextFieldMultiline } from '../../../utils/hooks/useAutoResizeTextFieldMultiline';
import { MergeResultsWizardContext } from '../MergeResultsWizardContext';
import { CompareFields } from './CompareFields';
import { SourceValue } from './SourceValue';

export const CompareAbstract = () => {
  const { t } = useTranslation();
  const { control, formState, register, setValue, resetField } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);

  const abstractValue = useWatch({ name: 'entityDescription.abstract', control });
  const [abstractRef, resizeAbstract] = useAutoResizeTextFieldMultiline();

  return (
    <CompareFields
      sourceContent={
        <SourceValue label={t('registration.description.abstract')} value={sourceResult.entityDescription?.abstract} />
      }
      targetContent={
        <TextField
          data-testid={dataTestId.registrationWizard.description.abstractField}
          variant="filled"
          label={t('registration.description.abstract')}
          multiline
          inputRef={abstractRef}
          {...register('entityDescription.abstract')}
        />
      }
      isMatching={(sourceResult.entityDescription?.abstract ?? '') === abstractValue}
      isChanged={abstractValue !== formState.defaultValues?.entityDescription?.abstract}
      onCopyValue={
        sourceResult.entityDescription?.abstract
          ? () => {
              setValue('entityDescription.abstract', sourceResult.entityDescription!.abstract);
              resizeAbstract();
            }
          : undefined
      }
      onResetValue={() => {
        resetField('entityDescription.abstract');
        resizeAbstract();
      }}
    />
  );
};
