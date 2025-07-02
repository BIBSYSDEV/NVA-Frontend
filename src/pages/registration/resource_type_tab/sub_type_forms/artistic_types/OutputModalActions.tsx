import { Button, DialogActions } from '@mui/material';
import { FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../../../utils/dataTestIds';

interface OutputModalActionsProps extends Pick<FormikProps<unknown>, 'isSubmitting'> {
  closeModal: () => void;
  isAddAction: boolean;
}

export const OutputModalActions = ({ isSubmitting, closeModal, isAddAction }: OutputModalActionsProps) => {
  const { t } = useTranslation();

  return (
    <DialogActions sx={{ justifyContent: 'center' }}>
      <Button onClick={closeModal}>{t('common.cancel')}</Button>
      <Button
        data-testid={dataTestId.registrationWizard.resourceType.artisticOutputSaveButton}
        disabled={isSubmitting}
        variant="contained"
        type="submit">
        {isAddAction ? t('common.add') : t('common.update')}
      </Button>
    </DialogActions>
  );
};
