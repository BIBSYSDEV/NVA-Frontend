import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ImportCandidate } from '../../../../types/importCandidate.types';
import { RegistrationTab } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { IdentifierParams, getImportCandidatePath } from '../../../../utils/urlPaths';

interface CentralImportCandidateFormActionsProps {
  tabNumber: RegistrationTab;
  setTabNumber: (newTab: RegistrationTab) => void;
}

export const CentralImportCandidateFormActions = ({
  tabNumber,
  setTabNumber,
}: CentralImportCandidateFormActionsProps) => {
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();
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
        <Link to={getImportCandidatePath(identifier)}>
          <Button size="small">{t('common.cancel')}</Button>
        </Link>

        {isLastTab ? (
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            data-testid={dataTestId.basicData.centralImport.importCandidateButton}
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
