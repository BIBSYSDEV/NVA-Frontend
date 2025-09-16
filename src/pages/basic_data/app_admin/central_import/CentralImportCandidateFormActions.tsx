import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ImportCandidate } from '../../../../types/importCandidate.types';
import { RegistrationTab } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';

interface CentralImportCandidateFormActionsProps {
  tabNumber: RegistrationTab;
  setTabNumber: (newTab: RegistrationTab) => void;
}

export const CentralImportCandidateFormActions = ({
  tabNumber,
  setTabNumber,
}: CentralImportCandidateFormActionsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isValid, isSubmitting } = useFormikContext<ImportCandidate>();

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
        <Button size="small" onClick={() => navigate(-1)}>
          {t('common.cancel')}
        </Button>

        {isLastTab ? (
          <Button
            type="submit"
            variant="contained"
            loading={isSubmitting}
            data-testid={dataTestId.basicData.centralImport.importCandidateButton}
            disabled={!isValid}>
            {t('basic_data.central_import.import')}
          </Button>
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
