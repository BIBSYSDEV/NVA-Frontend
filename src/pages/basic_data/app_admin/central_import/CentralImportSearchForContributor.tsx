import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ContributorName } from '../../../../components/ContributorName';
import { SimpleWarning } from '../../../../components/messages/SimpleWarning';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { dataTestId } from '../../../../utils/dataTestIds';

interface CentralImportSearchForContributorProps {
  importContributor: ImportContributor;
}

export const CentralImportSearchForContributor = ({ importContributor }: CentralImportSearchForContributorProps) => {
  const { t } = useTranslation();
  const isVerified = importContributor.identity.verificationStatus === 'Verified';

  return (
    <Accordion
      slotProps={{ heading: { component: 'p' } }}
      sx={{
        gridColumn: '3',
        border: '1px solid',
        borderRadius: '4px',
        boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.30)',
        backgroundColor: 'white',
        width: '30rem',
        height: 'fit-content',
      }}>
      <AccordionSummary
        sx={{
          fontWeight: 'normal',
          display: 'flex',
          alignItems: 'flex-start',
        }}
        expandIcon={<ExpandMoreIcon sx={{ mt: '1.5rem' }} />}
        aria-controls="panel1-content"
        id="panel1-header">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem' }}>
          {!isVerified && <SimpleWarning text={t('registration.contributors.contributor_is_unidentified')} />}
          <ContributorName
            name={importContributor.identity.name}
            hasVerifiedAffiliation={isVerified}
            id={importContributor.identity.id}
            orcId={importContributor.identity.orcId}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <TextField
          type="search"
          data-testid={dataTestId.registrationWizard.contributors.searchField}
          variant="outlined"
          fullWidth
          size="small"
          defaultValue={importContributor.identity.name}
        />
      </AccordionDetails>
    </Accordion>
  );
};
