import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useNviPeriodMutation } from '../../../../../api/hooks/useNviPeriodMutation';
import { HorizontalBox, VerticalBox } from '../../../../../components/styled/Wrappers';
import { NviPeriodDateTimeField } from './NviPeriodDateTimeField';
import { NviPeriodYearField } from './NviPeriodYearField';
import { NviPeriod } from '../../../../../types/nvi.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { checkWhichBasicDataPage } from '../../../../../utils/location-helpers/check-which-basic-data-page';
import { UrlPathTemplate } from '../../../../../utils/urlPaths';

interface UpsertNviPeriodDialogProps {
  refetchNviPeriods: () => Promise<unknown>;
  yearsWithPeriod: number[];
  nviPeriod: NviPeriod | null; // Provided for edit NviPeriod
  closeEditDialog: () => void;
}

export const UpsertNviPeriodDialog = ({
  refetchNviPeriods,
  yearsWithPeriod,
  nviPeriod,
  closeEditDialog,
}: UpsertNviPeriodDialogProps) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const { isOnNewNviPeriodPage } = checkWhichBasicDataPage(location.pathname, location.search);

  const nviPeriodMutation = useNviPeriodMutation(nviPeriod);

  const isEdit = !!nviPeriod;
  const dialogTitle = isEdit ? t('edit_reporting_period') : t('basic_data.nvi.add_reporting_period');
  const minNewNviPeriodYear = new Date().getFullYear();
  const yearPickerMinDate = isEdit ? undefined : new Date(minNewNviPeriodYear, 0, 1);
  const yearPickerMaxDate = isEdit ? undefined : new Date(minNewNviPeriodYear + 1, 0, 1);

  const shouldDisableYearOption = (date: Date) => {
    const yearToCheck = date.getFullYear();
    if (nviPeriod?.publishingYear === yearToCheck.toString()) return false; // Keep the period's own publishing year selectable
    return yearsWithPeriod.includes(yearToCheck); // Not possible to select years that already have a period
  };

  const closeDialog = () => (isEdit ? closeEditDialog() : navigate(UrlPathTemplate.BasicDataNvi));

  const formValues: Omit<NviPeriod, 'id' | 'status'> = nviPeriod
    ? {
        type: nviPeriod.type,
        publishingYear: nviPeriod.publishingYear,
        startDate: nviPeriod.startDate,
        reportingDate: nviPeriod.reportingDate,
      }
    : { type: 'NviPeriod', publishingYear: '', startDate: '', reportingDate: '' };

  return (
    <Dialog
      open={isOnNewNviPeriodPage || isEdit}
      onClose={closeDialog}
      data-testid={dataTestId.basicData.nviPeriod.nviPeriodDialog}>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <Formik
        initialValues={formValues}
        onSubmit={async (values) => {
          await nviPeriodMutation.mutateAsync(values);
          await refetchNviPeriods();
          closeDialog();
        }}>
        {({ isSubmitting }) => (
          <Form>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Trans t={t} i18nKey="reporting_period_text" components={{ p: <Typography /> }} />
              <VerticalBox sx={{ mt: '1rem', gap: '2rem' }}>
                <NviPeriodYearField
                  disabled={isEdit}
                  shouldDisableYear={shouldDisableYearOption}
                  minDate={yearPickerMinDate}
                  maxDate={yearPickerMaxDate}
                />
                <HorizontalBox sx={{ gap: '1.5rem' }}>
                  <NviPeriodDateTimeField
                    name="startDate"
                    label={t('common.start_date')}
                    dataTestId={dataTestId.basicData.nviPeriod.nviPeriodStartDate}
                  />
                  <NviPeriodDateTimeField
                    name="reportingDate"
                    label={t('common.end_date')}
                    dataTestId={dataTestId.basicData.nviPeriod.nviPeriodEndDate}
                  />
                </HorizontalBox>
              </VerticalBox>
            </DialogContent>
            <DialogActions sx={{ gap: '0.5rem' }}>
              <Button onClick={closeDialog}>{t('common.cancel')}</Button>
              <Button variant="contained" color="secondary" type="submit" loading={isSubmitting}>
                {t('common.save')}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
