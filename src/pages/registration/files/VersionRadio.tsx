import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup, Typography } from '@mui/material';
import { Field, FieldInputProps, FieldProps, useFormikContext } from 'formik';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { FileRrs, FileVersion } from '../../../types/associatedArtifact.types';
import { CustomerRrsType } from '../../../types/customerInstitution.types';
import { LicenseUri } from '../../../types/license.types';
import { SpecificFileFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { isTypeWithRrs } from '../../../utils/registration-helpers';

interface VersionRadioProps {
  baseFieldName: string;
  disabled: boolean;
  rrsStrategy: CustomerRrsType | undefined;
}

export const VersionRadio = ({ baseFieldName, disabled, rrsStrategy }: VersionRadioProps) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<Registration>();
  const { values } = useFormikContext<Registration>();

  const publisherVersionFieldName = `${baseFieldName}.${SpecificFileFieldNames.PublisherVersion}`;

  const setRrsValues = (fileVersion: string) => {
    const isCustomerRrs = rrsStrategy === CustomerRrsType.RightsRetentionStrategy;
    const isOverridableRrs = rrsStrategy === CustomerRrsType.OverridableRightsRetentionStrategy;

    const rrsFieldName = `${baseFieldName}.${SpecificFileFieldNames.RightsRetentionStrategy}`;
    const licenseFieldName = `${baseFieldName}.${SpecificFileFieldNames.License}`;

    if (fileVersion === FileVersion.Published) {
      const nullRrsValue: FileRrs = {
        type: 'NullRightsRetentionStrategy',
        configuredType: rrsStrategy,
      };

      setFieldValue(rrsFieldName, nullRrsValue);
      setFieldValue(licenseFieldName, null);
    } else if (isCustomerRrs || isOverridableRrs) {
      const customerRrsValue: FileRrs = {
        type: 'CustomerRightsRetentionStrategy',
        configuredType: rrsStrategy,
      };
      setFieldValue(rrsFieldName, customerRrsValue);
      setFieldValue(licenseFieldName, LicenseUri.CC_BY_4);
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>, field: FieldInputProps<FileVersion | null>) => {
    const fileVersion = event.target.value as FileVersion;
    setFieldValue(field.name, fileVersion);

    if (isTypeWithRrs(values.entityDescription?.reference?.publicationInstance?.type)) {
      setRrsValues(fileVersion);
    }
  };

  return (
    <Field name={publisherVersionFieldName}>
      {({ field, meta: { error, touched } }: FieldProps<FileVersion | null>) => (
        <FormControl data-testid={dataTestId.registrationWizard.files.version} required disabled={disabled}>
          <RadioGroup
            {...field}
            sx={{ flexWrap: 'nowrap', flexDirection: { lg: 'row', md: 'column' } }}
            onChange={(event) => onChange(event, field)}>
            <FormControlLabel
              value={FileVersion.Accepted}
              control={<Radio />}
              label={
                <Typography variant="caption" sx={{ lineHeight: '1.1rem' }}>
                  {t('registration.files_and_license.accepted_version')}
                </Typography>
              }
            />
            <FormControlLabel
              value={FileVersion.Published}
              control={<Radio />}
              label={
                <Typography variant="caption" sx={{ lineHeight: '1.1rem' }}>
                  {t('registration.files_and_license.published_version')}
                </Typography>
              }
            />
          </RadioGroup>
          {error && touched && <FormHelperText error>{error}</FormHelperText>}
        </FormControl>
      )}
    </Field>
  );
};
