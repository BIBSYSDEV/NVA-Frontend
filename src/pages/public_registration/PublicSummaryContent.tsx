import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export const PublicSummaryContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();

  const { entityDescription } = registration;

  return !entityDescription ? null : (
    <>
      {entityDescription.abstract && (
        <Typography style={{ whiteSpace: 'pre-line' }} paragraph>
          {entityDescription.abstract}
        </Typography>
      )}
      {entityDescription.alternativeAbstracts.und && (
        <Accordion elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />} sx={{ padding: '0' }}>
            <Typography variant="h3" color="primary">
              {t('registration.description.alternative_abstract')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <Typography style={{ whiteSpace: 'pre-line' }} paragraph>
              {entityDescription.alternativeAbstracts.und}
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}
      {entityDescription.description && (
        <>
          <Typography variant="h3" color="primary" gutterBottom>
            {t('common.description')}
          </Typography>
          <Typography style={{ whiteSpace: 'pre-line' }} paragraph>
            {entityDescription.description}
          </Typography>
        </>
      )}
    </>
  );
};
