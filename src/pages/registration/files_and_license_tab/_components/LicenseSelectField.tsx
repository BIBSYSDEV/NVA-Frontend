import { Box, MenuItem, TextField, Typography } from '@mui/material';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getLicenseData } from '../../../../utils/fileHelpers';
import {
  getAdditionalLicenses,
  getShortListLicenses,
  isCorrectLicenseForCategory,
  isSourceCodeCategory,
} from '../../../../utils/license-menu-helpers';
import { LicenseMenuItemContent } from './LicenseMenuItemContent';

interface LicenseSelectFieldProps {
  /** Formik path of the file's license field, e.g. `associatedArtifacts[0].license`. */
  fieldName: string;
  disabled: boolean;
}

/**
 * Select for the license on one file. Which licenses it offers follows the registration's category, which it
 * reads from the form rather than taking as a prop, so it cannot disagree with the value the form holds.
 *
 * The licenses behind {@link getAdditionalLicenses} stay hidden until the user expands the menu, and a stored
 * license the category no longer offers is shown as a disabled option so the value stays visible without
 * being selectable again.
 */
export const LicenseSelectField = ({ fieldName, disabled }: LicenseSelectFieldProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<Registration>();

  const [inactiveLicensesOpen, setInactiveLicensesOpen] = useState(false);

  const publicationInstanceType = values.entityDescription?.reference?.publicationInstance?.type;
  const isSourceCode = isSourceCodeCategory(publicationInstanceType);
  const shortListLicenses = getShortListLicenses(publicationInstanceType);
  const additionalLicenses = getAdditionalLicenses(publicationInstanceType);

  return (
    <Field name={fieldName}>
      {({ field, meta: { error, touched } }: FieldProps<string>) => {
        const storedLicense = getLicenseData(field.value);
        // A file registered before this category got its own license menu, or one the user
        // cannot edit, can hold a license the menu no longer offers.
        const storedLicenseIsNotInMenu =
          !!storedLicense && !isCorrectLicenseForCategory(field.value, publicationInstanceType);

        return (
          <TextField
            id={field.name}
            data-testid={dataTestId.registrationWizard.files.selectLicenseField}
            select
            fullWidth
            disabled={disabled}
            slotProps={{
              select: {
                renderValue: (option) => {
                  const selectedLicense = getLicenseData(option as string);

                  return selectedLicense ? (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}>
                      {selectedLicense.logo && <img style={{ width: '5rem' }} src={selectedLicense.logo} alt="" />}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedLicense.name}</span>
                    </Box>
                  ) : null;
                },
              },
            }}
            variant="filled"
            value={getLicenseData(field.value)?.id ?? ''}
            error={!!error && touched}
            helperText={
              // A license outside the menu still passes validation, which only requires the
              // field to be non-empty, so without this the field looks correct while holding
              // a value the category disallows.
              storedLicenseIsNotInMenu ? (
                t('registration.files_and_license.license_no_longer_valid')
              ) : (
                <ErrorMessage name={field.name} />
              )
            }
            label={t('registration.files_and_license.conditions_for_using_file')}
            required
            onChange={({ target: { value } }) => setFieldValue(field.name, value)}>
            {/* Showing it as a disabled option keeps the stored value visible and the Select in
              range, without letting anyone pick it again. */}
            {storedLicenseIsNotInMenu && (
              <MenuItem
                data-testid={dataTestId.registrationWizard.files.unavailableLicenseItem}
                value={storedLicense.id}
                disabled
                divider
                dense
                sx={{ gap: '1rem' }}>
                <LicenseMenuItemContent license={storedLicense} />
              </MenuItem>
            )}
            {shortListLicenses.map((license) => (
              <MenuItem
                data-testid={dataTestId.registrationWizard.files.licenseItem}
                key={license.id}
                value={license.id}
                divider
                dense
                sx={{ gap: '1rem' }}>
                <LicenseMenuItemContent license={license} />
              </MenuItem>
            ))}
            {!inactiveLicensesOpen && (
              <MenuItem
                data-testid={dataTestId.registrationWizard.files.licenseItemShowOlderVersion}
                sx={{ display: 'flex', justifyContent: 'center' }}
                onClickCapture={(e) => {
                  e.stopPropagation();
                  setInactiveLicensesOpen(!inactiveLicensesOpen);
                }}>
                <Typography sx={{ fontStyle: 'italic' }}>
                  {isSourceCode
                    ? t('registration.files_and_license.show_full_license_list')
                    : t('registration.files_and_license.show_all_older_versions')}
                </Typography>
              </MenuItem>
            )}
            {additionalLicenses.map((license) => (
              <MenuItem
                data-testid={dataTestId.registrationWizard.files.licenseItem}
                key={license.id}
                value={license.id}
                divider
                dense
                sx={{ gap: '1rem', display: inactiveLicensesOpen ? 'flex' : 'none' }}>
                <LicenseMenuItemContent license={license} />
              </MenuItem>
            ))}
          </TextField>
        );
      }}
    </Field>
  );
};
