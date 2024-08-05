import { Checkbox } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';
import { FileType } from '../../../types/associatedArtifact.types';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';

export const markForPublishId = 'mark-for-publish';

interface MarkForPublishCheckProps {
  baseFieldName: string;
  disabled: boolean;
}

export const PublishCheck = ({ baseFieldName, disabled }: MarkForPublishCheckProps) => {
  const fileTypeFieldName = `${baseFieldName}.${SpecificFileFieldNames.Type}`;
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <Field name={fileTypeFieldName}>
      {({ field }: FieldProps) => (
        <Checkbox
          {...field}
          data-testid={dataTestId.registrationWizard.files.toPublishCheckbox}
          checked={field.value === FileType.UnpublishedFile || field.value === FileType.PublishedFile}
          disabled={disabled}
          inputProps={{
            'aria-labelledby': markForPublishId,
          }}
          onChange={(_, checked) => {
            if (!checked) {
              setFieldValue(fileTypeFieldName, FileType.UnpublishableFile);
            } else {
              setFieldValue(fileTypeFieldName, FileType.UnpublishedFile);
            }
          }}
        />
      )}
    </Field>
  );
};
