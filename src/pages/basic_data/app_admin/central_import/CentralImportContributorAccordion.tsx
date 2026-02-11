import AddIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContributorName } from '../../../../components/ContributorName';
import { OrganizationBox } from '../../../../components/institution/OrganizationBox';
import { UnconfirmedOrganizationBox } from '../../../../components/institution/UnconfirmedOrganizationBox';
import { SimpleWarning } from '../../../../components/messages/SimpleWarning';
import { Contributor } from '../../../../types/contributor.types';
import { ContributorFieldNames } from '../../../../types/publicationFieldNames';
import { CristinPerson } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { AddAffiliationModal } from '../../../registration/contributors_tab/components/AddAffiliationModal';
import { CentralImportContributorSearchBar } from './CentralImportContributorSearchBar';

interface CentralImportContributorAccordionProps {
  contributor: Contributor;
  onSelectPerson: (selectedPerson: CristinPerson) => void;
  onSelectPersonAndAffiliation: (selectedContributor: CristinPerson) => void;
}

export const CentralImportContributorAccordion = ({
  contributor,
  onSelectPerson,
  onSelectPersonAndAffiliation,
}: CentralImportContributorAccordionProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const baseFieldName = `${ContributorFieldNames.Contributors}[${contributor.sequence - 1}]`;
  const [affiliationToVerify, setAffiliationToVerify] = useState('');
  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const handleChange = (_event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded);
  };

  const isVerified = contributor && contributor.identity.verificationStatus === 'Verified';

  const onIdentifyAffiliationClick = (affiliationString: string) => {
    setAffiliationToVerify(affiliationString);
    toggleAffiliationModal();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Accordion
        expanded={expanded}
        onChange={handleChange}
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
          }}
          expandIcon={<ExpandMoreIcon />}
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
          <CentralImportContributorSearchBar
            isExpanded={expanded}
            contributor={contributor}
            onSelectPerson={onSelectPerson}
            onSelectPersonAndAffiliation={onSelectPersonAndAffiliation}
          />
        </AccordionDetails>
      </Accordion>
      {contributor &&
        contributor.affiliations?.map((affiliation, index) =>
          affiliation.type === 'Organization' ? (
            <OrganizationBox key={affiliation.id + index} unitUri={affiliation.id} />
          ) : (
            <UnconfirmedOrganizationBox
              key={`${affiliation.name}${index}`}
              name={affiliation.name}
              onIdentifyAffiliationClick={onIdentifyAffiliationClick}
            />
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
      <AddAffiliationModal
        openAffiliationModal={openAffiliationModal}
        affiliationToVerify={affiliationToVerify}
        setAffiliationToVerify={setAffiliationToVerify}
        toggleAffiliationModal={toggleAffiliationModal}
        authorName={contributor.identity.name}
        affiliations={contributor.affiliations}
        baseFieldName={baseFieldName}
      />
    </Box>
  );
};
