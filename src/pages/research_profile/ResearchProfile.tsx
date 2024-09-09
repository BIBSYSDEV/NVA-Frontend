import LinkIcon from '@mui/icons-material/Link';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link as MuiLink,
  List,
  Typography,
} from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchPerson, searchForProjects } from '../../api/cristinApi';
import { fetchPromotedPublicationsById } from '../../api/preferencesApi';
import { fetchResults, FetchResultsParams } from '../../api/searchApi';
import { AffiliationHierarchy } from '../../components/institution/AffiliationHierarchy';
import { ListPagination } from '../../components/ListPagination';
import { PageSpinner } from '../../components/PageSpinner';
import { ProfilePicture } from '../../components/ProfilePicture';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { getLanguageString } from '../../utils/translation-helpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { filterActiveAffiliations, getFullCristinName, getOrcidUri } from '../../utils/user-helpers';
import NotFound from '../errorpages/NotFound';
import { UserOrcid } from '../my_page/user_profile/UserOrcid';
import { UserOrcidHelperModal } from '../my_page/user_profile/UserOrcidHelperModal';
import { ProjectListItem } from '../search/project_search/ProjectListItem';
import { RegistrationSearchResults } from '../search/registration_search/RegistrationSearchResults';

const ResearchProfile = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [registrationsPage, setRegistrationsPage] = useState(1);
  const [projectsPage, setProjectsPage] = useState(1);
  const [projectRowsPerPage, setProjectRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [registrationRowsPerPage, setRegistrationRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

  const user = useSelector((store: RootState) => store.user);

  const currentCristinId = user?.cristinId ?? '';
  const isPublicPage = location.pathname === UrlPathTemplate.ResearchProfile;
  const personId = isPublicPage
    ? (new URLSearchParams(location.search).get('id') ?? '') // Page for Research Profile of anyone
    : currentCristinId; // Page for My Research Profile

  const personIdNumber = getIdentifierFromId(personId);

  const personQuery = useQuery({
    enabled: !!personId,
    queryKey: ['person', personId],
    queryFn: () => fetchPerson(personId),
    meta: { errorMessage: t('feedback.error.get_person') },
  });

  const person = personQuery.data;

  const registrationsQueryConfig: FetchResultsParams = {
    contributor: personId,
    from: (registrationsPage - 1) * registrationRowsPerPage,
    results: registrationRowsPerPage,
  };
  const registrationsQuery = useQuery({
    enabled: !!personId,
    queryKey: ['registrations', registrationsQueryConfig],
    queryFn: () => fetchResults(registrationsQueryConfig),
    meta: { errorMessage: t('feedback.error.get_registrations') },
  });

  const projectsQuery = useQuery({
    queryKey: ['projects', projectRowsPerPage, projectsPage, personIdNumber],
    queryFn: () => searchForProjects(projectRowsPerPage, projectsPage, { participant: personIdNumber }),
    meta: { errorMessage: t('feedback.error.project_search') },
    placeholderData: keepPreviousData,
  });

  const projects = projectsQuery.data?.hits ?? [];

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

  const registrationsHeading = registrationsQuery.data
    ? `${t('my_page.my_profile.results')} (${registrationsQuery.data.totalHits})`
    : t('my_page.my_profile.results');

  const projectHeading = projectsQuery.data
    ? `${t('my_page.my_profile.projects')} (${projectsQuery.data.size})`
    : t('my_page.my_profile.projects');

  return personQuery.isPending ? (
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
        <Helmet>
          <title>{fullName}</title>
        </Helmet>

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
            <Typography fontWeight="bold">{t('my_page.my_profile.contact_information')}</Typography>
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
              <Grid item>
                <UserOrcid user={user} />
              </Grid>
            )}

            <Grid item>
              <UserOrcidHelperModal />
            </Grid>
            <Grid item>
              <Typography>{t('my_page.my_profile.orcid.orcid_description')}</Typography>
            </Grid>
          </Grid>
        )}
        {(!!personBackground || personKeywords.length > 0) && (
          <Box sx={{ width: '80%', mt: '1rem' }}>
            <Typography variant="h3" gutterBottom>
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
        <Typography id="registration-label" variant="h2" gutterBottom sx={{ mt: '2rem' }}>
          {registrationsHeading}
        </Typography>
        {registrationsQuery.isPending || promotedPublicationsQuery.isPending ? (
          <CircularProgress aria-labelledby="registration-label" />
        ) : registrationsQuery.data && registrationsQuery.data.totalHits > 0 ? (
          <ListPagination
            count={registrationsQuery.data.totalHits}
            rowsPerPage={registrationRowsPerPage}
            page={registrationsPage}
            onPageChange={(newPage) => setRegistrationsPage(newPage)}
            onRowsPerPageChange={(newRowsPerPage) => {
              setRegistrationRowsPerPage(newRowsPerPage);
              setRegistrationsPage(1);
            }}>
            <RegistrationSearchResults
              searchResult={registrationsQuery.data.hits}
              promotedPublications={promotedPublications}
            />
          </ListPagination>
        ) : (
          <Typography>{t('common.no_hits')}</Typography>
        )}

        <Divider sx={{ my: '1rem' }} />

        <Typography id="project-label" variant="h2" sx={{ mt: '1rem' }}>
          {projectHeading}
        </Typography>
        {projectsQuery.isPending ? (
          <CircularProgress aria-labelledby="project-label" />
        ) : projects.length > 0 ? (
          <ListPagination
            count={projectsQuery.data?.size ?? 0}
            rowsPerPage={projectRowsPerPage}
            page={projectsPage}
            onPageChange={(newPage) => setProjectsPage(newPage)}
            onRowsPerPageChange={(newRowsPerPage) => {
              setProjectRowsPerPage(newRowsPerPage);
              setProjectsPage(1);
            }}>
            <List>
              {projects.map((project) => (
                <ProjectListItem key={project.id} project={project} refetchProjects={projectsQuery.refetch} />
              ))}
            </List>
          </ListPagination>
        ) : (
          <Typography>{t('common.no_hits')}</Typography>
        )}
      </BackgroundDiv>
    </div>
  );
};

export default ResearchProfile;
