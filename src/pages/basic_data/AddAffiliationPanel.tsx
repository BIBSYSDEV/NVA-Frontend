import { Box, Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import { useState } from 'react';
import { Field, FieldProps } from 'formik';
import { SelectInstitutionForm } from '../../components/institution/SelectInstitutionForm';
import { StyledCenterContainer } from '../../components/styled/Wrappers';

export const AddAffiliationPanel = () => {
  const { t } = useTranslation('basicData');
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledCenterContainer>
        <LooksTwoIcon color="primary" fontSize="large" />
      </StyledCenterContainer>
      <Field name="affiliation.organization">
        {({ field, form }: FieldProps<string>) => (
          <>
            <Button variant="outlined" onClick={() => setOpen(true)}>
              Velg institusjon
            </Button>
            <Dialog open={open} fullWidth onClose={() => setOpen(false)}>
              <DialogTitle>Velg institusjon</DialogTitle>
              <DialogContent>
                <SelectInstitutionForm
                  onSubmit={(id) => {
                    console.log(id);
                    form.setFieldValue(field.name, id);
                    setOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </>
        )}
      </Field>
      <Box display={{ display: 'flex', gap: '1rem' }}>
        <Field name="affiliation.position">
          {({ field }: FieldProps<string>) => <TextField {...field} fullWidth variant="filled" label={t('position')} />}
        </Field>
        <Field name="affiliation.percent">
          {({ field }: FieldProps<string>) => (
            <TextField {...field} fullWidth variant="filled" label={t('position_percent')} />
          )}
        </Field>
      </Box>
      <Box display={{ display: 'flex', gap: '1rem' }}>
        <Field name="affiliation.startDate">
          {({ field }: FieldProps<string>) => (
            <TextField {...field} fullWidth variant="filled" label={t('common:start_date')} />
          )}
        </Field>
        <Field name="affiliation.endDate">
          {({ field }: FieldProps<string>) => (
            <TextField {...field} fullWidth variant="filled" label={t('common:end_date')} />
          )}
        </Field>
      </Box>
    </>
  );
};
