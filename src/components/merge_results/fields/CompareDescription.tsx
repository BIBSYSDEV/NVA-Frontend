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

export const CompareDescription = () => {
  const { t } = useTranslation();
  const { control, formState, register, setValue, resetField } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);

  const descriptionValue = useWatch({ name: 'entityDescription.description', control });
  const [descriptionRef, resizeDescription] = useAutoResizeTextFieldMultiline();

  return (
    <CompareFields
      sourceContent={
        <SourceValue label={t('common.description')} value={sourceResult.entityDescription?.description} />
      }
      targetContent={
        <TextField
          data-testid={dataTestId.registrationWizard.description.descriptionField}
          variant="filled"
          label={t('common.description')}
          multiline
          inputRef={descriptionRef}
          {...register('entityDescription.description')}
        />
      }
      isMatching={(sourceResult.entityDescription?.description ?? '') === descriptionValue}
      isChanged={descriptionValue !== formState.defaultValues?.entityDescription?.description}
      onCopyValue={
        sourceResult.entityDescription?.description
          ? () => {
              setValue('entityDescription.description', sourceResult.entityDescription!.description);
              resizeDescription();
            }
          : undefined
      }
      onResetValue={() => {
        resetField('entityDescription.description');
        resizeDescription();
      }}
    />
  );
};
