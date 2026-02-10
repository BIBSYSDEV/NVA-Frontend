import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchForOrganizations } from '../../../../api/hooks/useSearchForOrganizations';
import { OrganizationBox } from '../../../../components/institution/OrganizationBox';
import { ListSkeleton } from '../../../../components/ListSkeleton';
import { UnconfirmedOrganization } from '../../../../types/common.types';
import { Organization } from '../../../../types/organization.types';
import { dataTestId } from '../../../../utils/dataTestIds';

interface UnconfirmedOrganizationAccordionProps {
  affiliation: UnconfirmedOrganization;
  onSelectInstitution: (selectedInstitution: Organization) => void;
}
export const UnconfirmedOrganizationAccordion = ({
  affiliation,
  onSelectInstitution,
}: UnconfirmedOrganizationAccordionProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | boolean>(false);
  const [searchTerm, setSearchTerm] = useState(affiliation.name);
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const organizationSearchQuery = useSearchForOrganizations({
    query: submittedSearchTerm,
    results: 10,
  });

  const organizationSearchResults = organizationSearchQuery.data?.hits ?? [];

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleSearch = () => {
    setSubmittedSearchTerm(searchTerm);
    organizationSearchQuery.refetch();
  };

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
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem' }}>
            <Box sx={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              <ErrorIcon color="warning" />
              <Typography fontWeight="bold">{t('registration.contributors.affiliation_is_unidentified')}</Typography>
            </Box>
            <Typography>{affiliation.name}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            type="search"
            data-testid={dataTestId.registrationWizard.contributors.searchField}
            variant="outlined"
            fullWidth
            onChange={(event) => {
              setSearchTerm(event.target.value);
              if (page !== 1) {
                setPage(1);
              }
            }}
            size="small"
            defaultValue={searchTerm}
          />
          <Button
            variant="contained"
            color="tertiary"
            sx={{ padding: '0.1rem 0.75rem', width: 'fit-content' }}
            onClick={handleSearch}
            startIcon={<SearchIcon />}>
            {t('project.search_for_institution')}
          </Button>

          {organizationSearchQuery.isFetching ? (
            <ListSkeleton arrayLength={3} minWidth={100} height={80} />
          ) : organizationSearchResults && organizationSearchResults.length > 0 ? (
            <>
              {organizationSearchResults.map((institution, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}>
                  <OrganizationBox key={institution.id} unitUri={institution.id} />

                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ padding: '0.1rem 0.75rem', width: 'fit-content', mt: '0.5rem' }}
                    onClick={() => onSelectInstitution(institution)}>
                    {t('select_person_and_affiliation')}
                  </Button>
                </Box>
              ))}
            </>
          ) : (
            submittedSearchTerm && <Typography>{t('common.no_hits')}</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
