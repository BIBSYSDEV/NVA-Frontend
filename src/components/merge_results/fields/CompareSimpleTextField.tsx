import { TextField } from '@mui/material';
import { Path, useFormContext, useWatch } from 'react-hook-form';
import { JournalRegistration } from '../../../types/publication_types/journalRegistration.types';
import { CompareFields } from './CompareFields';
import { SourceValue } from './SourceValue';

interface CompareSimpleTextFieldProps {
  label: string;
  sourceValue: string | null | undefined;
  originalTargetValue: string | null | undefined;
  fieldName: Path<JournalRegistration>;
  dataTestId: string;
}

export const CompareSimpleTextField = ({
  label,
  sourceValue = '',
  originalTargetValue = '',
  fieldName,
  dataTestId,
}: CompareSimpleTextFieldProps) => {
  const { control, register, setValue, resetField } = useFormContext<JournalRegistration>();
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
