import AddIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContributorName } from '../../../../components/ContributorName';
import { OrganizationBox } from '../../../../components/institution/OrganizationBox';
import { UnconfirmedOrganizationBox } from '../../../../components/institution/UnconfirmedOrganizationBox';
import { SimpleWarning } from '../../../../components/messages/SimpleWarning';
import { UnconfirmedOrganization } from '../../../../types/common.types';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { Organization } from '../../../../types/organization.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { CentralImportContributorSearchBar } from './CentralImportContributorSearchBar';

interface CentralImportSearchForContributorProps {
  importContributor: ImportContributor;
}

export const CentralImportSearchForContributor = ({ importContributor }: CentralImportSearchForContributorProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | boolean>(false);
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const isVerified = importContributor.identity.verificationStatus === 'Verified';
  const verifiedTargetOrganizations = importContributor.affiliations
    .map((a) => a.targetOrganization)
    .filter((org): org is Organization => !!org && org.type === 'Organization' && org.id.length > 0);

  const unverifiedTargetOrganizations = importContributor.affiliations
    .map((a) => a.targetOrganization)
    .filter((org): org is UnconfirmedOrganization => !!org && org.type === 'UnconfirmedOrganization');

  return (
    <Box sx={{ gridColumn: '3', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Accordion
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
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
          <CentralImportContributorSearchBar isExpanded={expanded} importContributor={importContributor} />
        </AccordionDetails>
      </Accordion>
      {verifiedTargetOrganizations.map((org) => {
        return <OrganizationBox key={org.id} unitUri={org.id} />;
      })}
      {unverifiedTargetOrganizations.map((org, index) => {
        return <UnconfirmedOrganizationBox key={index} name={org.name} />;
      })}

      <Button
        color="tertiary"
        variant="contained"
        sx={{ padding: '0.1rem 0.75rem', width: 'fit-content' }}
        data-testid={dataTestId.registrationWizard.contributors.addAffiliationButton}
        startIcon={<AddIcon />}
        onClick={toggleAffiliationModal}>
        {t('registration.contributors.add_affiliation')}
      </Button>
    </Box>
  );
};
