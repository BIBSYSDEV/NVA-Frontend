import { Accordion, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouterLink, useParams } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../utils/dataTestIds';
import { getFirstErrorTab, TabErrors } from '../../../utils/formik-helpers';
import { getRegistrationPath, RegistrationParams } from '../../../utils/urlPaths';
import { ErrorList } from '../../registration/ErrorList';

interface ValidationAccordionProps {
  errors: TabErrors;
}

export const ValidationAccordion = ({ errors }: ValidationAccordionProps) => {
  const { t } = useTranslation();
  const { identifier } = useParams<RegistrationParams>();
  const firstErrorTab = getFirstErrorTab(errors);

  return (
    <Accordion elevation={3}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        Valideringsfeil <WarningIcon color="warning" sx={{ ml: '0.5rem' }} />
      </AccordionSummary>
      <AccordionDetails>
        <ErrorList
          tabErrors={errors}
          description={<Typography>{t('registration.public_page.error_description')}</Typography>}
          actions={
            <Button
              variant="outlined"
              component={RouterLink}
              to={`${getRegistrationPath(identifier)}?tab=${firstErrorTab}`}
              endIcon={<EditIcon />}
              data-testid={dataTestId.registrationLandingPage.backToWizard}>
              {t('registration.public_page.go_back_to_wizard')}
            </Button>
          }
        />
      </AccordionDetails>
    </Accordion>
  );
};
