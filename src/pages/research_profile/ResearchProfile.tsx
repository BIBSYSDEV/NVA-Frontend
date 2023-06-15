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
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { useSearchRegistrations } from '../../utils/hooks/useSearchRegistrations';
import { PageSpinner } from '../../components/PageSpinner';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../types/publicationFieldNames';
import { ExpressionStatement } from '../../utils/searchHelpers';
import { filterActiveAffiliations, getFullCristinName, getOrcidUri } from '../../utils/user-helpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { RootState } from '../../redux/store';
import { RegistrationSearchResults } from '../search/registration_search/RegistrationSearchResults';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { fetchPerson } from '../../api/cristinApi';
import { setNotification } from '../../redux/notificationSlice';
import NotFound from '../errorpages/NotFound';
import { getLanguageString } from '../../utils/translation-helpers';

const textContainerSx: SxProps = {
  width: '100%',
};

const ResearchProfile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const currentCristinId = useSelector((store: RootState) => store.user?.cristinId) ?? '';
  const isPublicPage = history.location.pathname === UrlPathTemplate.ResearchProfile;
  const personId = isPublicPage
    ? new URLSearchParams(history.location.search).get('id') ?? '' // Page for Research Profile of anyone
    : currentCristinId; // Page for My Research Profile

  const personQuery = useQuery({
    enabled: !!personId,
    queryKey: [personId],
    queryFn: () => fetchPerson(personId),
    onError: () => dispatch(setNotification({ message: t('feedback.error.get_person'), variant: 'error' })),
  });

  const person = personQuery.data;

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

  return personQuery.isLoading ? (
    <PageSpinner aria-label={t('my_page.research_profile')} />
  ) : !person ? (
    <NotFound />
  ) : (
    <div>
      <Box sx={{ bgcolor: 'person.main', py: '1.1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Typography variant="h1" sx={{ ml: '2rem' }}>
          {fullName}
        </Typography>
        {orcidUri && <img src={orcidIcon} height="20" alt="orcid" />}
      </Box>
      <BackgroundDiv>
        <Helmet>
          <title>{fullName}</title>
        </Helmet>

        {activeAffiliations.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              gap: '0.5rem',
              mt: '1rem',
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
            }}>
            {activeAffiliations.map(({ organization, role }) => (
              <Box
                key={organization}
                sx={{
                  width: 'fit-content',
                  pr: '1.5rem',
                  borderRight: { xs: 'none', sm: '1px solid' },
                  borderBottom: { xs: '1px solid', sm: 'none' },
                  borderColor: 'primary.main',
                }}>
                <Typography sx={{ fontWeight: 'bold' }}>{getLanguageString(role.labels)} &bull;</Typography>
                <AffiliationHierarchy key={organization} unitUri={organization} />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>{t('my_page.no_employments')}</Typography>
        )}
        {orcidUri && (
          <Box sx={{ display: 'flex', gap: '1rem', mt: '1rem', alignItems: 'center' }}>
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
          <>
            <Typography id="registration-label" variant="h2" sx={{ mt: '2rem' }}>
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
          </>
        )}
      </BackgroundDiv>
    </div>
  );
};

export default ResearchProfile;
