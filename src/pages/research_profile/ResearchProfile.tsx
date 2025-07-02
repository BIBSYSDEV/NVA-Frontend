import LinkIcon from '@mui/icons-material/Link';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import { Box, Chip, Divider, Grid, IconButton, List, Link as MuiLink, Typography } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router';
import { ProjectSearchParameter, ProjectsSearchParams, searchForProjects } from '../../api/cristinApi';
import { useFetchPersonByIdentifier } from '../../api/hooks/useFetchPerson';
import { useRegistrationSearch } from '../../api/hooks/useRegistrationSearch';
import { fetchPromotedPublicationsById } from '../../api/preferencesApi';
import { FetchResultsParams, ResultParam } from '../../api/searchApi';
import { HeadTitle } from '../../components/HeadTitle';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import { ListPagination } from '../../components/ListPagination';
import { ListSkeleton } from '../../components/ListSkeleton';
import { PageSpinner } from '../../components/PageSpinner';
import { ProfilePicture } from '../../components/ProfilePicture';
import { projectSortOptions } from '../../components/ProjectSortSelector';
import { RegistrationList } from '../../components/RegistrationList';
import { SortSelectorWithoutParams } from '../../components/SortSelectorWithoutParams';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { SearchParam } from '../../utils/searchHelpers';
import { getLanguageString } from '../../utils/translation-helpers';
import { IdentifierParams, UrlPathTemplate } from '../../utils/urlPaths';
import { filterActiveAffiliations, getFullCristinName, getOrcidUri } from '../../utils/user-helpers';
import { SearchTypeValue } from '../dashboard/HomePage';
import NotFound from '../errorpages/NotFound';
import { UserOrcid } from '../my_page/user_profile/UserOrcid';
import { UserOrcidHelperModal } from '../my_page/user_profile/UserOrcidHelperModal';
import { ProjectListItem } from '../search/project_search/ProjectListItem';
import { registrationSortOptions } from '../search/registration_search/RegistrationSortSelector';

const ResearchProfile = () => {
  const { t } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();
  const location = useLocation();
  const [registrationsPage, setRegistrationsPage] = useState(1);
  const [registrationRowsPerPage, setRegistrationRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [registrationSort, setRegistrationSort] = useState(registrationSortOptions[0]);

  const [projectsPage, setProjectsPage] = useState(1);
  const [projectRowsPerPage, setProjectRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [projectSort, setProjectSort] = useState(projectSortOptions[0]);

  useEffect(() => {
    // Reset pagination when visiting a new research profile
    setRegistrationsPage(1);
    setProjectsPage(1);
  }, [location.search]);

  const user = useSelector((store: RootState) => store.user);

  const currentCristinId = user?.cristinId ?? '';
  const isPublicPage = location.pathname.startsWith(UrlPathTemplate.ResearchProfileRoot) && identifier;
  const personIdentifier = isPublicPage
    ? identifier // Page for Research Profile of anyone
    : getIdentifierFromId(currentCristinId); // Page for My Research Profile

  const personQuery = useFetchPersonByIdentifier(personIdentifier);
  const person = personQuery.data;

  const registrationsQueryConfig: FetchResultsParams = {
    contributor: personIdentifier,
    from: (registrationsPage - 1) * registrationRowsPerPage,
    results: registrationRowsPerPage,
    order: registrationSort.orderBy,
    sort: registrationSort.sortOrder,
  };

  const registrationsQuery = useRegistrationSearch({
    enabled: !!personIdentifier,
    params: registrationsQueryConfig,
    keepDataWhileLoading: true,
  });

  const projectsQueryConfig: ProjectsSearchParams = {
    participant: personIdentifier,
    orderBy: projectSort.orderBy,
    sort: projectSort.sortOrder,
  };

  const projectsQuery = useQuery({
    queryKey: ['projects', projectRowsPerPage, projectsPage, projectsQueryConfig],
    queryFn: () => searchForProjects(projectRowsPerPage, projectsPage, projectsQueryConfig),
    meta: { errorMessage: t('feedback.error.project_search') },
    placeholderData: keepPreviousData,
  });

  const projects = projectsQuery.data?.hits ?? [];

  const personId = person?.id ?? '';

  const promotedPublicationsQuery = useQuery({
    enabled: !!personId,
    queryKey: ['person-preferences', personId],
    queryFn: () => fetchPromotedPublicationsById(personId),
    meta: { errorMessage: false },
    retry: false,
  });

  const promotedPublications = promotedPublicationsQuery.data?.promotedPublications;

  const fullName = person?.names ? getFullCristinName(person.names) : '';
  const orcidUri = getOrcidUri(person?.identifiers);
  const activeAffiliations = person?.affiliations ? filterActiveAffiliations(person.affiliations) : [];
  const personBackground = getLanguageString(person?.background);
  const personKeywords = person?.keywords ?? [];

  const registrationsHeading =
    registrationsQuery.data?.totalHits && registrationsQuery.data.totalHits > 0
      ? `${t('my_page.my_profile.results')} (${registrationsQuery.data.totalHits})`
      : t('my_page.my_profile.results');

  const projectHeading =
    projectsQuery.data?.size && projectsQuery.data.size > 0
      ? `${t('my_page.my_profile.projects')} (${projectsQuery.data.size})`
      : t('my_page.my_profile.projects');

  const isPending =
    personQuery.isPending ||
    registrationsQuery.isPending ||
    projectsQuery.isPending ||
    promotedPublicationsQuery.isPending;

  return personQuery.isError ? (
    <NotFound />
  ) : isPending ? (
    <PageSpinner aria-label={t('my_page.research_profile')} />
  ) : !person ? (
    <NotFound />
  ) : (
    <div>
      <HeadTitle>{fullName}</HeadTitle>
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
        <ProfilePicture
          personId={personId}
          fullName={fullName}
          isPublicPage
          sx={{
            height: '5rem',
            position: 'absolute',
            mt: '3rem',
            ml: '1rem',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        />
        <Typography variant="h1" sx={{ ml: '7rem', color: 'primary.contrastText' }}>
          {fullName}
        </Typography>
        {orcidUri && <img src={orcidIcon} height="20" alt="orcid" />}
      </Box>
      <BackgroundDiv>
        {activeAffiliations.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              gap: '0.5rem',
              mt: '1.5rem',
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
                <AffiliationHierarchy unitUri={organization} />
              </Box>
            ))}
          </Box>
        ) : (
          <Typography sx={{ mt: '1.5rem' }}>{t('my_page.no_employments')}</Typography>
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

        {(person.contactDetails?.email || person.contactDetails?.telephone || person.contactDetails?.webPage) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', mt: '0.75rem' }}>
            <Typography variant="h3" component="h2">
              {t('my_page.my_profile.contact_information')}
            </Typography>
            {person.contactDetails.email && (
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <MailOutlineIcon />
                <MuiLink href={`mailto:${person.contactDetails.email}`}>{person.contactDetails.email}</MuiLink>
              </Box>
            )}
            {person.contactDetails.telephone && (
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <PhoneEnabledIcon />
                <MuiLink href={`tel:${person.contactDetails.telephone}`}>{person.contactDetails.telephone}</MuiLink>
              </Box>
            )}
            {person.contactDetails.webPage && (
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <LinkIcon />
                <MuiLink href={person.contactDetails.webPage} target="_blank" rel="noopener noreferrer">
                  {person.contactDetails.webPage}
                </MuiLink>
              </Box>
            )}
          </Box>
        )}

        {!orcidUri && location.pathname.includes(UrlPathTemplate.MyPageResearchProfile) && (
          <Grid
            sx={{
              backgroundColor: 'secondary.dark',
              my: '1rem',
              borderRadius: '4px',
              alignItems: 'center',
              paddingBottom: '4px',
            }}
            container
            spacing={1}>
            {user && (
              <Grid>
                <UserOrcid user={user} />
              </Grid>
            )}

            <Grid>
              <UserOrcidHelperModal />
            </Grid>
            <Grid>
              <Typography>{t('my_page.my_profile.orcid.orcid_description')}</Typography>
            </Grid>
          </Grid>
        )}
        {(!!personBackground || personKeywords.length > 0) && (
          <Box sx={{ width: '80%', mt: '1rem' }}>
            <Typography variant="h3" component="h2" gutterBottom>
              {t('my_page.my_profile.field_and_background.field_and_background')}
            </Typography>
            {personKeywords.length > 0 && (
              <Box sx={{ display: 'flex', gap: '0.5rem', mb: '1rem', flexWrap: 'wrap' }}>
                {personKeywords.map((keyword) => (
                  <Chip color="primary" key={keyword.type} label={getLanguageString(keyword.label)} />
                ))}
              </Box>
            )}
            {!!personBackground && <Typography>{personBackground}</Typography>}
          </Box>
        )}
        <Typography variant="h2" gutterBottom sx={{ mt: '2rem' }}>
          {registrationsHeading}
        </Typography>
        {registrationsQuery.data?.totalHits && registrationsQuery.data.totalHits > 0 ? (
          <Typography>
            <Trans i18nKey="my_page.my_profile.link_to_results_search">
              <MuiLink component={Link} to={`/?${ResultParam.Contributor}=${encodeURIComponent(personIdentifier)}`} />
            </Trans>
          </Typography>
        ) : null}
        <ListPagination
          paginationAriaLabel={t('common.pagination_result_search')}
          count={registrationsQuery.data?.totalHits ?? 0}
          rowsPerPage={registrationRowsPerPage}
          page={registrationsPage}
          onPageChange={(newPage) => setRegistrationsPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRegistrationRowsPerPage(newRowsPerPage);
            setRegistrationsPage(1);
          }}
          sortingComponent={
            <SortSelectorWithoutParams
              options={registrationSortOptions}
              value={registrationSort}
              setValue={(value) => {
                setRegistrationsPage(1);
                setRegistrationSort(value);
              }}
            />
          }>
          {registrationsQuery.isFetching ? (
            <ListSkeleton minWidth={100} height={100} />
          ) : registrationsQuery.data && registrationsQuery.data.totalHits > 0 ? (
            <RegistrationList
              registrations={registrationsQuery.data.hits}
              promotedPublications={promotedPublications}
            />
          ) : (
            <Typography>{t('common.no_hits')}</Typography>
          )}
        </ListPagination>
        <Divider sx={{ my: '1rem' }} />

        <Typography variant="h2" gutterBottom sx={{ mt: '1rem' }}>
          {projectHeading}
        </Typography>
        {projectsQuery.data?.size && projectsQuery.data.size > 0 ? (
          <Typography>
            <Trans t={t} i18nKey="my_page.my_profile.link_to_projects_search">
              <MuiLink
                component={Link}
                to={`/?${SearchParam.Type}=${SearchTypeValue.Project}&${ProjectSearchParameter.ParticipantFacet}=${encodeURIComponent(
                  getIdentifierFromId(personId)
                )}`}
              />
            </Trans>
          </Typography>
        ) : null}
        <ListPagination
          paginationAriaLabel={t('common.pagination_project_search')}
          count={projectsQuery.data?.size ?? 0}
          rowsPerPage={projectRowsPerPage}
          page={projectsPage}
          onPageChange={(newPage) => setProjectsPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setProjectRowsPerPage(newRowsPerPage);
            setProjectsPage(1);
          }}
          sortingComponent={
            <SortSelectorWithoutParams
              options={projectSortOptions}
              value={projectSort}
              setValue={(value) => {
                setProjectsPage(1);
                setProjectSort(value);
              }}
            />
          }>
          {projectsQuery.isFetching ? (
            <ListSkeleton minWidth={100} height={100} />
          ) : projects.length > 0 ? (
            <List>
              {projects.map((project) => (
                <ProjectListItem key={project.id} project={project} refetchProjects={projectsQuery.refetch} />
              ))}
            </List>
          ) : (
            <Typography>{t('common.no_hits')}</Typography>
          )}
        </ListPagination>
      </BackgroundDiv>
    </div>
  );
};

export default ResearchProfile;
