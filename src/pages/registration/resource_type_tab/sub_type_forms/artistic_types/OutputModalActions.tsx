import { DialogActions, Button } from '@mui/material';
import { FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import SaveIcon from '@mui/icons-material/Save';
import { dataTestId } from '../../../../../utils/dataTestIds';

interface OutputModalActionsProps extends Pick<FormikProps<unknown>, 'isSubmitting'> {
  closeModal: () => void;
  isAddAction: boolean;
}

export const OutputModalActions = ({ isSubmitting, closeModal, isAddAction }: OutputModalActionsProps) => {
  const { t } = useTranslation();

  return (
    <DialogActions>
      <Button onClick={closeModal}>{t('common.cancel')}</Button>
      <Button
        data-testid={dataTestId.registrationWizard.resourceType.artisticOutputSaveButton}
        disabled={isSubmitting}
        variant="contained"
        type="submit"
        startIcon={<SaveIcon />}>
        {isAddAction ? t('common.add') : t('common.update')}
      </Button>
    </DialogActions>
  );
};
