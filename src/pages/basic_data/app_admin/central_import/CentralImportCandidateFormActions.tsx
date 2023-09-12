import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { createRegistrationFromImportCandidate } from '../../../../api/registrationApi';
import { setNotification } from '../../../../redux/notificationSlice';
import { ImportCandidate } from '../../../../types/importCandidate.types';
import { RegistrationTab } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { UrlPathTemplate } from '../../../../utils/urlPaths';

interface CentralImportCandidateFormActionsProps {
  tabNumber: RegistrationTab;
  setTabNumber: (newTab: RegistrationTab) => void;
}

export const CentralImportCandidateFormActions = ({
  tabNumber,
  setTabNumber,
}: CentralImportCandidateFormActionsProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { values, isValid } = useFormikContext<ImportCandidate>();

  const importCandidateMutation = useMutation({
    mutationFn: async () => await createRegistrationFromImportCandidate(values),
    onSuccess: () => {
      dispatch(
        setNotification({
          message: t('feedback.success.create_registration'),
          variant: 'success',
        })
      );
      history.push(UrlPathTemplate.BasicDataCentralImport);
    },
    onError: () =>
      dispatch(
        setNotification({
          message: t('feedback.error.create_registration'),
          variant: 'error',
        })
      ),
  });

  const isFirstTab = tabNumber === RegistrationTab.Description;
  const isLastTab = tabNumber === RegistrationTab.FilesAndLicenses;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateAreas: "'back next'",
        gridTemplateColumns: 'auto 1fr',
        gap: '1rem',
      }}>
      {!isFirstTab && (
        <Tooltip title={t('common.previous')} sx={{ gridArea: 'back' }}>
          <IconButton
            onClick={() => setTabNumber(tabNumber - 1)}
            data-testid={dataTestId.registrationWizard.formActions.previousTabButton}>
            <KeyboardArrowLeftIcon
              sx={{
                color: 'white',
                borderRadius: '50%',
                bgcolor: 'primary.light',
                height: '1.875rem',
                width: '1.875rem',
              }}
            />
          </IconButton>
        </Tooltip>
      )}

      <Box sx={{ gridArea: 'next', display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '2rem' }}>
        <Link to={UrlPathTemplate.BasicDataCentralImport}>
          <Button size="small">{t('common.cancel')}</Button>
        </Link>

        {isLastTab ? (
          <LoadingButton
            variant="contained"
            loading={importCandidateMutation.isLoading}
            data-testid={dataTestId.basicData.centralImport.importCandidateButton}
            onClick={() => importCandidateMutation.mutate()}
            disabled={!isValid}>
            {t('basic_data.central_import.import')}
          </LoadingButton>
        ) : (
          <Tooltip title={t('common.next')}>
            <IconButton
              onClick={() => setTabNumber(tabNumber + 1)}
              data-testid={dataTestId.registrationWizard.formActions.nextTabButton}>
              <KeyboardArrowRightIcon
                sx={{
                  color: 'white',
                  borderRadius: '50%',
                  bgcolor: 'primary.light',
                  height: '1.875rem',
                  width: '1.875rem',
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};
