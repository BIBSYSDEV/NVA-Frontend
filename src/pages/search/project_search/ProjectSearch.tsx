import { Box, List, Typography } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchParam } from '../../../utils/searchHelpers';
import { CristinSearchPagination } from '../CristinSearchPagination';
import { SearchTextField } from '../SearchTextField';
import { ProjectListItem } from './ProjectListItem';
import { useQuery } from '@tanstack/react-query';
import { searchForProjects } from '../../../api/cristinApi';

export const ProjectSearch = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const projectSearchQueryParams = new URLSearchParams(location.search);
  projectSearchQueryParams.delete(SearchParam.Type);

  if (!projectSearchQueryParams.get(SearchParam.Results)) {
    projectSearchQueryParams.set(SearchParam.Results, '10');
  }
  if (!projectSearchQueryParams.get(SearchParam.Page)) {
    projectSearchQueryParams.set(SearchParam.Page, '1');
  }

  const rowsPerPage = Number(projectSearchQueryParams.get(SearchParam.Results));
  const page = Number(projectSearchQueryParams.get(SearchParam.Page));
  const query = projectSearchQueryParams.get(SearchParam.Query);

  const projectsQuery = useQuery({
    queryKey: ['projects', rowsPerPage, page, query],
    queryFn: () => searchForProjects(rowsPerPage, page, { query: query ?? undefined }),
    meta: { errorMessage: t('feedback.error.project_search') },
  });

  const projectsSearchResults = projectsQuery.data?.hits ?? [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Field name="searchTerm">
        {({ field, form: { submitForm } }: FieldProps<string>) => (
          <SearchTextField
            {...field}
            placeholder={t('search.project_search_placeholder')}
            clearValue={() => {
              field.onChange({ target: { value: '', id: field.name } });
              submitForm();
            }}
          />
        )}
      </Field>

      {projectsQuery.isLoading ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : projectsSearchResults && projectsSearchResults.length > 0 ? (
        <>
          <List>
            {projectsSearchResults.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </List>
          <CristinSearchPagination totalCount={projectsQuery.data?.size ?? 0} />
        </>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </Box>
  );
};
