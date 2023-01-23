import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  IconButton,
  Link as MuiLink,
  SxProps,
  TablePagination,
  Typography,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import { useSelector } from 'react-redux';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import { PageHeader } from '../../components/PageHeader';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { useSearchRegistrations } from '../../utils/hooks/useSearchRegistrations';
import { PageSpinner } from '../../components/PageSpinner';
import { useFetch } from '../../utils/hooks/useFetch';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../types/publicationFieldNames';
import { ExpressionStatement } from '../../utils/searchHelpers';
import { CristinPerson } from '../../types/user.types';
import { filterActiveAffiliations, getFullCristinName, getOrcidUri } from '../../utils/user-helpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { RootState } from '../../redux/store';
import { RegistrationSearchResults } from '../search/registration_search/RegistrationSearchResults';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';

const textContainerSx: SxProps = {
  width: '100%',
};

const lineSx: SxProps = {
  display: 'flex',
  gap: '1rem',
  mt: '1rem',
};

const ResearchProfile = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const currentCristinId = useSelector((store: RootState) => store.user?.cristinId) ?? '';
  const isPublicPage = history.location.pathname === UrlPathTemplate.ResearchProfile;
  const personId = isPublicPage
    ? new URLSearchParams(history.location.search).get('id') ?? '' // Page for Research Profile of anyone
    : currentCristinId; // Page for My Research Profile

  const [person, isLoadingPerson] = useFetch<CristinPerson>({
    url: personId,
    errorMessage: t('feedback.error.get_person'),
  });

  const [registrations, isLoadingRegistrations] = useSearchRegistrations(
    {
      properties: [
        {
          fieldName: `${ContributorFieldNames.Contributors}.${SpecificContributorFieldNames.Id}`,
          value: personId,
          operator: ExpressionStatement.Contains,
        },
      ],
    },
    rowsPerPage,
    rowsPerPage * page
  );

  const fullName = person?.names ? getFullCristinName(person.names) : '';
  const orcidUri = getOrcidUri(person?.identifiers);
  const activeAffiliations = person?.affiliations ? filterActiveAffiliations(person.affiliations) : [];

  return (
    <BackgroundDiv>
      <PageHeader>{fullName}</PageHeader>
      {isLoadingPerson ? (
        <PageSpinner aria-label={t('my_page.research_profile')} />
      ) : (
        person && (
          <>
            <Typography variant="h2">{t('common.employments')}</Typography>
            {activeAffiliations.length > 0 && (
              <Box sx={lineSx}>
                <WorkIcon />
                <Box sx={textContainerSx}>
                  {activeAffiliations.map(({ organization }) => (
                    <AffiliationHierarchy key={organization} unitUri={organization} commaSeparated />
                  ))}
                </Box>
              </Box>
            )}
            {orcidUri && (
              <Box sx={lineSx}>
                <IconButton size="small" href={orcidUri} target="_blank">
                  <img src={orcidIcon} height="20" alt="orcid" />
                </IconButton>
                <Box sx={textContainerSx}>
                  <Typography component={MuiLink} href={orcidUri} target="_blank" rel="noopener noreferrer">
                    {orcidUri}
                  </Typography>
                </Box>
              </Box>
            )}
            {registrations && (
              <Box sx={{ mt: '2rem' }}>
                <Typography id="registration-label" variant="h2" gutterBottom>
                  {t('common.registrations')}
                </Typography>
                {isLoadingRegistrations && !registrations ? (
                  <CircularProgress aria-labelledby="registration-label" />
                ) : registrations.size > 0 ? (
                  <>
                    <RegistrationSearchResults searchResult={registrations} />
                    <TablePagination
                      rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                      component="div"
                      count={registrations.size}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={(_, newPage) => setPage(newPage)}
                      onRowsPerPageChange={(event) => {
                        setRowsPerPage(+event.target.value);
                        setPage(0);
                      }}
                    />
                  </>
                ) : (
                  <Typography>{t('common.no_hits')}</Typography>
                )}
              </Box>
            )}
          </>
        )
      )}
    </BackgroundDiv>
  );
};

export default ResearchProfile;
