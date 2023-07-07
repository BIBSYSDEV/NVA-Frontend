import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  List,
  Link as MuiLink,
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
import { fetchPerson, searchForProjects } from '../../api/cristinApi';
import { setNotification } from '../../redux/notificationSlice';
import NotFound from '../errorpages/NotFound';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { ProjectListItem } from '../search/project_search/ProjectListItem';
import { getLanguageString } from '../../utils/translation-helpers';

const ResearchProfile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const [registrationsPage, setRegistrationsPage] = useState(0);
  const [projectsPage, setProjectsPage] = useState(0);
  const [projectRowsPerPage, setProjectRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [registrationRowsPerPage, setRegistrationRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const currentCristinId = useSelector((store: RootState) => store.user?.cristinId) ?? '';
  const isPublicPage = history.location.pathname === UrlPathTemplate.ResearchProfile;
  const personId = isPublicPage
    ? new URLSearchParams(history.location.search).get('id') ?? '' // Page for Research Profile of anyone
    : currentCristinId; // Page for My Research Profile

  const personIdNumber = getIdentifierFromId(personId);

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
    registrationRowsPerPage,
    registrationRowsPerPage * registrationsPage
  );

  const projectsQuery = useQuery({
    queryKey: ['projects', projectRowsPerPage, projectsPage, personIdNumber],
    queryFn: () => searchForProjects(projectRowsPerPage, projectsPage + 1, { participant: personIdNumber }),
    meta: { errorMessage: t('feedback.error.project_search') },
    keepPreviousData: true,
  });

  const projects = projectsQuery.data?.hits ?? [];

  const fullName = person?.names ? getFullCristinName(person.names) : '';
  const orcidUri = getOrcidUri(person?.identifiers);
  const activeAffiliations = person?.affiliations ? filterActiveAffiliations(person.affiliations) : [];

  return personQuery.isLoading ? (
    <PageSpinner aria-label={t('my_page.research_profile')} />
  ) : !person ? (
    <NotFound />
  ) : (
    <div>
      <Box
        sx={{
          bgcolor: 'primary.main',
          py: '1.1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          borderLeft: 'solid 1rem',
          borderLeftColor: 'person.main',
        }}>
        <Typography variant="h1" sx={{ ml: '2rem', color: 'primary.contrastText' }}>
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
          <Box sx={{ display: 'flex', gap: '0.5rem', mt: '1rem', alignItems: 'center' }}>
            <IconButton size="small" href={orcidUri} target="_blank">
              <img src={orcidIcon} height="20" alt="orcid" />
            </IconButton>
            <Typography component={MuiLink} href={orcidUri} target="_blank" rel="noopener noreferrer">
              {orcidUri}
            </Typography>
          </Box>
        )}
        <Typography id="registration-label" variant="h2" gutterBottom sx={{ mt: '2rem' }}>
          {`${t('my_page.my_profile.results')} ${registrations && `(${registrations.size}`})`}
        </Typography>
        {registrations && (
          <>
            {isLoadingRegistrations && !registrations ? (
              <CircularProgress aria-labelledby="registration-label" />
            ) : registrations.size > 0 ? (
              <>
                <RegistrationSearchResults searchResult={registrations} />
                <TablePagination
                  rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                  component="div"
                  count={registrations.size}
                  rowsPerPage={registrationRowsPerPage}
                  page={registrationsPage}
                  onPageChange={(_, newPage) => setRegistrationsPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setRegistrationRowsPerPage(+event.target.value);
                    setRegistrationsPage(0);
                  }}
                />
              </>
            ) : (
              <Typography>{t('common.no_hits')}</Typography>
            )}
          </>
        )}

        <Divider />
        <Typography id="project-label" variant="h2" sx={{ mt: '1rem' }}>
          {`${t('my_page.my_profile.projects')} (${projectsQuery.data?.size ?? 0})`}
        </Typography>
        {projectsQuery.isLoading ? (
          <CircularProgress aria-labelledby="project-label" />
        ) : projects.length > 0 ? (
          <>
            <List>
              {projects.map((project) => (
                <ProjectListItem key={project.id} project={project} refetchProjects={projectsQuery.refetch} />
              ))}
            </List>
            <TablePagination
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
              component="div"
              count={projectsQuery.data?.size ?? 0}
              rowsPerPage={projectRowsPerPage}
              page={projectsPage}
              onPageChange={(_, newPage) => setProjectsPage(newPage)}
              onRowsPerPageChange={(event) => {
                setProjectRowsPerPage(+event.target.value);
                setProjectsPage(0);
              }}
            />
          </>
        ) : (
          <Typography>{t('common.no_hits')}</Typography>
        )}
      </BackgroundDiv>
    </div>
  );
};

export default ResearchProfile;
