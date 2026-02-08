import AddIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContributorName } from '../../../../components/ContributorName';
import { OrganizationBox } from '../../../../components/institution/OrganizationBox';
import { UnconfirmedOrganizationBox } from '../../../../components/institution/UnconfirmedOrganizationBox';
import { SimpleWarning } from '../../../../components/messages/SimpleWarning';
import { Contributor } from '../../../../types/contributor.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { CentralImportContributorSearchBar } from './CentralImportContributorSearchBar';

interface CentralImportSearchForContributorProps {
  contributor: Contributor;
}

export const CentralImportSearchForContributor = ({ contributor }: CentralImportSearchForContributorProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | boolean>(false);
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const isVerified = contributor && contributor.identity.verificationStatus === 'Verified';

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
            {contributor && (
              <ContributorName
                name={contributor.identity.name}
                hasVerifiedAffiliation={
                  !!contributor.affiliations?.some((affiliation) => affiliation.type === 'Organization')
                }
                id={contributor.identity.id}
                orcId={contributor.identity.orcId}
              />
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <CentralImportContributorSearchBar isExpanded={expanded} contributor={contributor} />
        </AccordionDetails>
      </Accordion>
      {contributor &&
        contributor.affiliations?.map((affiliation, index) =>
          affiliation.type === 'Organization' ? (
            <OrganizationBox key={affiliation.id} unitUri={affiliation.id} />
          ) : (
            <UnconfirmedOrganizationBox key={`${affiliation.name}${index}`} name={affiliation.name} />
          )
        )}

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
