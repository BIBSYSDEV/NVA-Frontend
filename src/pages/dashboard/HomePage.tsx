import FilterIcon from '@mui/icons-material/FilterAltOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation } from 'react-router-dom';
import {
  PersonSearchParameter,
  PersonSearchParams,
  ProjectSearchParameter,
  ProjectsSearchParams,
  searchForPerson,
  searchForProjects,
} from '../../api/cristinApi';
import { useRegistrationSearch } from '../../api/hooks/useRegistrationSearch';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { NavigationList, SideNavHeader, StyledPageWithSideMenu } from '../../components/PageWithSideMenu';
import { SelectableButton } from '../../components/SelectableButton';
import { SideMenu } from '../../components/SideMenu';
import { ROWS_PER_PAGE_OPTIONS } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useRegistrationsQueryParams } from '../../utils/hooks/useRegistrationSearchParams';
import { SearchParam } from '../../utils/searchHelpers';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { ClinicalTreatmentStudiesReports } from '../reports/ClinicalTreatmentStudiesReports';
import { InternationalCooperationReports } from '../reports/InternationalCooperationReports';
import { NviReports } from '../reports/NviReports';
import ReportsPage from '../reports/ReportsPage';
import { SearchPage } from '../search/SearchPage';
import { AdvancedSearchPage } from '../search/advanced_search/AdvancedSearchPage';
import { PersonFacetsFilter } from '../search/person_search/PersonFacetsFilter';
import { ProjectFacetsFilter } from '../search/project_search/ProjectFacetsFilter';
import { RegistrationFacetsFilter } from '../search/registration_search/filters/RegistrationFacetsFilter';

enum SearchTypeValue {
  Result = 'result',
  Person = 'person',
  Project = 'project',
}

const HomePage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paramsSearchType = params.get(SearchParam.Type);

  const currentPath = location.pathname.replace(/\/$/, ''); // Remove trailing slash

  const isOnFilterPage = location.pathname === UrlPathTemplate.Root;
  const resultIsSelected = isOnFilterPage && (!paramsSearchType || paramsSearchType === SearchTypeValue.Result);
  const personIsSeleced = isOnFilterPage && paramsSearchType === SearchTypeValue.Person;
  const projectIsSelected = isOnFilterPage && paramsSearchType === SearchTypeValue.Project;

  const rowsPerPage = Number(params.get(SearchParam.Results) ?? ROWS_PER_PAGE_OPTIONS[0]);
  const page = Number(params.get(SearchParam.Page) ?? 1);

  const registrationParams = useRegistrationsQueryParams();
  const registrationQuery = useRegistrationSearch({
    enabled: resultIsSelected,
    params: { ...registrationParams, aggregation: 'all' },
    keepDataWhileLoading: true,
  });

  const personSearchTerm = params.get(PersonSearchParameter.Name) ?? '.';
  const personQueryParams: PersonSearchParams = {
    name: personSearchTerm,
    orderBy: params.get(PersonSearchParameter.OrderBy),
    organization: params.get(PersonSearchParameter.Organization),
    sector: params.get(PersonSearchParameter.Sector),
    sort: params.get(PersonSearchParameter.Sort),
  };
  const personQuery = useQuery({
    enabled: personIsSeleced,
    queryKey: ['person', rowsPerPage, page, personQueryParams],
    queryFn: () => searchForPerson(rowsPerPage, page, personQueryParams),
    meta: { errorMessage: t('feedback.error.search') },
    placeholderData: keepPreviousData,
  });

  const projectSearchTerm = params.get(ProjectSearchParameter.Query);
  const projectQueryParams: ProjectsSearchParams = {
    coordinatingFacet: params.get(ProjectSearchParameter.CoordinatingFacet),
    categoryFacet: params.get(ProjectSearchParameter.CategoryFacet),
    fundingSourceFacet: params.get(ProjectSearchParameter.FundingSourceFacet),
    healthProjectFacet: params.get(ProjectSearchParameter.HealthProjectFacet),
    orderBy: params.get(ProjectSearchParameter.OrderBy),
    participantFacet: params.get(ProjectSearchParameter.ParticipantFacet),
    participantOrgFacet: params.get(ProjectSearchParameter.ParticipantOrgFacet),
    responsibleFacet: params.get(ProjectSearchParameter.ResponsibleFacet),
    sectorFacet: params.get(ProjectSearchParameter.SectorFacet),
    sort: params.get(ProjectSearchParameter.Sort),
    status: params.get(ProjectSearchParameter.Status),
    query: projectSearchTerm,
  };
  const projectQuery = useQuery({
    enabled: projectIsSelected,
    queryKey: ['projects', rowsPerPage, page, projectQueryParams],
    queryFn: () => searchForProjects(rowsPerPage, page, projectQueryParams),
    meta: { errorMessage: t('feedback.error.project_search') },
    placeholderData: keepPreviousData,
  });

  return (
    <StyledPageWithSideMenu>
      <SideMenu>
        <SideNavHeader icon={SearchIcon} text={t('common.search')} />
        <NavigationListAccordion
          title={t('search.advanced_search.advanced_search')}
          startIcon={<SearchIcon sx={{ bgcolor: 'white' }} />}
          accordionPath={UrlPathTemplate.Search}
          dataTestId={dataTestId.startPage.advancedSearchAccordion}>
          <Typography sx={{ m: '0.5rem 1rem 1rem 1rem' }}>
            {t('search.advanced_search.advanced_search_description')}
          </Typography>
        </NavigationListAccordion>

        <NavigationListAccordion
          title={t('common.filter')}
          startIcon={<FilterIcon sx={{ bgcolor: 'white' }} />}
          accordionPath=""
          expanded={currentPath === ''}
          dataTestId={dataTestId.startPage.filterAccordion}>
          <Box sx={{ m: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {resultIsSelected ? (
              <RegistrationFacetsFilter registrationQuery={registrationQuery} />
            ) : personIsSeleced ? (
              personQuery.data?.aggregations ? (
                <PersonFacetsFilter personQuery={personQuery} />
              ) : null
            ) : projectIsSelected ? (
              projectQuery.data?.aggregations ? (
                <ProjectFacetsFilter projectQuery={projectQuery} />
              ) : null
            ) : null}
          </Box>
        </NavigationListAccordion>

        <NavigationListAccordion
          title={t('search.reports.reports')}
          startIcon={<InsightsIcon sx={{ bgcolor: 'white' }} />}
          accordionPath={UrlPathTemplate.Reports}
          dataTestId={dataTestId.startPage.reportsAccordion}>
          <NavigationList>
            <SelectableButton
              data-testid={dataTestId.startPage.reportsOverviewButton}
              isSelected={currentPath === UrlPathTemplate.Reports}
              to={UrlPathTemplate.Reports}>
              {t('common.overview')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.startPage.reportsNviButton}
              isSelected={currentPath === UrlPathTemplate.ReportsNvi}
              to={UrlPathTemplate.ReportsNvi}>
              {t('common.nvi')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.startPage.reportsInternationalWorkButton}
              isSelected={currentPath === UrlPathTemplate.ReportsInternationalCooperation}
              to={UrlPathTemplate.ReportsInternationalCooperation}>
              {t('search.reports.international_cooperation')}
            </SelectableButton>
            <SelectableButton
              data-testid={dataTestId.startPage.reportsClinicalTreatmentStudiesButton}
              isSelected={currentPath === UrlPathTemplate.ReportsClinicalTreatmentStudies}
              to={UrlPathTemplate.ReportsClinicalTreatmentStudies}>
              {t('search.reports.clinical_treatment_studies')}
            </SelectableButton>
          </NavigationList>
        </NavigationListAccordion>
      </SideMenu>

      <ErrorBoundary>
        <Routes>
          <Route
            index
            path={UrlPathTemplate.Root}
            element={
              <SearchPage registrationQuery={registrationQuery} personQuery={personQuery} projectQuery={projectQuery} />
            }
          />
          <Route path={UrlPathTemplate.Search} element={<AdvancedSearchPage />} />
          <Route path={UrlPathTemplate.Reports} element={<ReportsPage />} />
          <Route path={UrlPathTemplate.ReportsNvi} element={<NviReports />} />
          <Route path={UrlPathTemplate.ReportsInternationalCooperation} element={<InternationalCooperationReports />} />
          <Route path={UrlPathTemplate.ReportsClinicalTreatmentStudies} element={<ClinicalTreatmentStudiesReports />} />
        </Routes>
      </ErrorBoundary>
    </StyledPageWithSideMenu>
  );
};

export default HomePage;
