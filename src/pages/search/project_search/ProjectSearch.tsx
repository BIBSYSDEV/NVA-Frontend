import { Box, List, Typography } from '@mui/material';
import { Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { CristinApiPath } from '../../../api/apiPaths';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchResponse } from '../../../types/common.types';
import { CristinProject } from '../../../types/project.types';
import { useFetch } from '../../../utils/hooks/useFetch';
import { SearchParam } from '../../../utils/searchHelpers';
import { CristinSearchPagination } from '../CristinSearchPagination';
import { SearchTextField } from '../SearchTextField';
import { ProjectListItem } from './ProjectListItem';

export const ProjectSearch = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const projectSearchQueryParams = new URLSearchParams(location.search);
  projectSearchQueryParams.delete(SearchParam.Type);

  if (!projectSearchQueryParams.get(SearchParam.Query)) {
    projectSearchQueryParams.set(SearchParam.Query, '.');
  }
  if (!projectSearchQueryParams.get(SearchParam.Results)) {
    projectSearchQueryParams.set(SearchParam.Results, '10');
  }

  const queryParams = projectSearchQueryParams.toString();

  const [projectsSearch, isLoadingProjectsSearch] = useFetch<SearchResponse<CristinProject>>({
    url: queryParams ? `${CristinApiPath.Project}?${queryParams}` : '',
    errorMessage: t('feedback.error.project_search'),
  });

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

      {isLoadingProjectsSearch ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : projectsSearch && projectsSearch.hits.length > 0 ? (
        <>
          <List>
            {projectsSearch.hits.map((project) => (
              <ProjectListItem key={project.id} project={project} />
            ))}
          </List>
          <CristinSearchPagination totalCount={projectsSearch.size} />
        </>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </Box>
  );
};
