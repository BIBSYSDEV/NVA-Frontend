import { TextField } from '@mui/material';
import { Path, useFormContext, useWatch } from 'react-hook-form';
import { JournalRegistration } from '../../../types/publication_types/journalRegistration.types';
import { Registration } from '../../../types/registration.types';
import { useAutoResizeTextFieldMultiline } from '../../../utils/hooks/useAutoResizeTextFieldMultiline';
import { CompareFields } from './CompareFields';
import { SourceValue } from './SourceValue';

type RegistrationType = Registration | JournalRegistration;

interface CompareTextFieldProps {
  label: string;
  sourceValue: string | null | undefined;
  originalTargetValue: string | null | undefined;
  fieldName: Path<RegistrationType>;
  dataTestId: string;
}

export const CompareTextField = ({
  label,
  sourceValue = '',
  originalTargetValue = '',
  fieldName,
  dataTestId,
}: CompareTextFieldProps) => {
  const { control, register, setValue, resetField } = useFormContext<RegistrationType>();
  const currentTargetValue = useWatch({ name: fieldName, control }) ?? '';

  return (
    <CompareFields
      sourceContent={<SourceValue label={label} value={sourceValue} />}
      targetContent={<TextField data-testid={dataTestId} variant="filled" label={label} {...register(fieldName)} />}
      isMatching={sourceValue === currentTargetValue}
      isChanged={originalTargetValue !== currentTargetValue}
      onCopyValue={sourceValue ? () => setValue(fieldName, sourceValue) : undefined}
      onResetValue={() => resetField(fieldName)}
    />
  );
};

export const CompareMultilineTextField = ({
  label,
  sourceValue = '',
  originalTargetValue = '',
  fieldName,
  dataTestId,
}: CompareTextFieldProps) => {
  const { control, register, setValue, resetField } = useFormContext<RegistrationType>();
  const currentTargetValue = useWatch({ name: fieldName, control }) ?? '';
  const [inputRef, resizeField] = useAutoResizeTextFieldMultiline();

  return (
    <CompareFields
      sourceContent={<SourceValue label={label} value={sourceValue} />}
      targetContent={
        <TextField
          data-testid={dataTestId}
          variant="filled"
          label={label}
          multiline
          inputRef={inputRef}
          {...register(fieldName)}
        />
      }
      isMatching={sourceValue === currentTargetValue}
      isChanged={originalTargetValue !== currentTargetValue}
      onCopyValue={
        sourceValue
          ? () => {
              setValue(fieldName, sourceValue);
              resizeField();
            }
          : undefined
      }
      onResetValue={() => {
        resetField(fieldName);
        resizeField();
      }}
    />
  );
};
