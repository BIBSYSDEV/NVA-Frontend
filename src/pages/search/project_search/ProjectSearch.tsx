import { List } from '@mui/material';
import { useLocation } from 'react-router';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { NoSearchResults } from '../../../components/NoSearchResults';
import { ProjectSortSelector } from '../../../components/ProjectSortSelector';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { SearchParam } from '../../../utils/searchHelpers';
import { CristinSearchPagination } from '../CristinSearchPagination';
import { SearchPageProps } from '../SearchPage';
import { ProjectListItem } from './ProjectListItem';

type ProjectSearchProps = Pick<SearchPageProps, 'projectQuery'>;

export const ProjectSearch = ({ projectQuery }: ProjectSearchProps) => {
  const projectsSearchResults = projectQuery.data?.hits ?? [];
  const totalHits = projectQuery.data?.size ?? 0;

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const resultsParam = params.get(SearchParam.Results);
  const pageParam = params.get(SearchParam.Page);
  const page = pageParam ? +pageParam : 1;

  const rowsPerPage = resultsParam ? +resultsParam : ROWS_PER_PAGE_OPTIONS[0];

  return (
    <CristinSearchPagination
      totalCount={totalHits}
      page={page}
      rowsPerPage={rowsPerPage}
      sortingComponent={<ProjectSortSelector />}>
      {projectQuery.isFetching ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : projectsSearchResults && projectsSearchResults.length > 0 ? (
        <List>
          {projectsSearchResults.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </List>
      ) : (
        <NoSearchResults />
      )}
    </CristinSearchPagination>
  );
};
