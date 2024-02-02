import { Box, List, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { ListPaginationTop } from '../../../components/ListPaginationTop';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { SearchParam } from '../../../utils/searchHelpers';
import { CristinSearchPagination } from '../CristinSearchPagination';
import { SearchPageProps } from '../SearchPage';
import { ProjectListItem } from './ProjectListItem';

type ProjectSearchProps = Pick<SearchPageProps, 'projectQuery'>;

export const ProjectSearch = ({ projectQuery }: ProjectSearchProps) => {
  const { t } = useTranslation();

  const projectsSearchResults = projectQuery.data?.hits ?? [];
  const totalHits = projectQuery.data?.size ?? 0;

  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const resultsParam = params.get(SearchParam.Results);
  const pageParam = params.get(SearchParam.Page);
  const page = pageParam ? +pageParam : 1;

  const rowsPerPage = resultsParam ? +resultsParam : ROWS_PER_PAGE_OPTIONS[0];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {projectQuery.isLoading ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : projectsSearchResults && projectsSearchResults.length > 0 ? (
        <div>
          <ListPaginationTop count={totalHits} page={page} rowsPerPage={rowsPerPage} />
          <List>
            {projectsSearchResults.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </List>
          <CristinSearchPagination totalCount={totalHits} page={page} rowsPerPage={rowsPerPage} />
        </div>
      ) : (
        <Typography sx={{ mx: { xs: '0.5rem', md: 0 } }}>{t('common.no_hits')}</Typography>
      )}
    </Box>
  );
};
