import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ContributorName } from '../../../../components/ContributorName';
import { OrganizationBox } from '../../../../components/institution/OrganizationBox';
import { SimpleWarning } from '../../../../components/messages/SimpleWarning';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { Organization } from '../../../../types/organization.types';
import { dataTestId } from '../../../../utils/dataTestIds';

interface CentralImportSearchForContributorProps {
  importContributor: ImportContributor;
}

export const CentralImportSearchForContributor = ({ importContributor }: CentralImportSearchForContributorProps) => {
  const { t } = useTranslation();
  const isVerified = importContributor.identity.verificationStatus === 'Verified';
  const targetOrganizations = importContributor.affiliations
    .map((a) => a.targetOrganization)
    .filter((org): org is Organization => !!org && org.type === 'Organization' && org.id.length > 0);

  return (
    <Box sx={{ gridColumn: '3', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Accordion
        slotProps={{ heading: { component: 'p' } }}
        sx={{
          border: '1px solid',
          borderRadius: '4px',
          boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.30)',
          backgroundColor: 'white',
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
        <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            type="search"
            data-testid={dataTestId.registrationWizard.contributors.searchField}
            variant="outlined"
            fullWidth
            size="small"
            defaultValue={importContributor.identity.name}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ padding: '0.1rem 0.75rem', width: 'fit-content' }}
              data-testid={dataTestId.registrationWizard.contributors.verifyContributorButton(
                importContributor.identity.name
              )}
              startIcon={<SearchIcon />}>
              {t('basic_data.add_employee.search_for_person')}
            </Button>
            <Button variant="contained" color="tertiary" sx={{ padding: '0.1rem 0.75rem', width: 'fit-content' }}>
              {t('update_name')}
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
      {targetOrganizations.map((org) => {
        return <OrganizationBox key={org.id} unitUri={org.id} />;
      })}
    </Box>
  );
};
