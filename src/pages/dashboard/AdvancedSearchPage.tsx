import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SearchForm } from '../../components/SearchForm';
import { SortSelector } from '../../components/SortSelector';
import { RegistrationFieldName } from '../../types/publicationFieldNames';

export const AdvancedSearchPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <SearchForm
          sx={{ width: '100%' }}
          name="title"
          label={t('common.title')}
          placeholder={t('search.search_for_title')}
        />
        <SortSelector
          options={[
            {
              orderBy: RegistrationFieldName.ModifiedDate,
              sortOrder: 'desc',
              label: t('search.sort_by_modified_date'),
            },
            {
              orderBy: RegistrationFieldName.PublishedDate,
              sortOrder: 'desc',
              label: t('search.sort_by_published_date_desc'),
            },
            {
              orderBy: RegistrationFieldName.PublishedDate,
              sortOrder: 'asc',
              label: t('search.sort_by_published_date_asc'),
            },
          ]}
        />
      </Box>
    </>
  );
};
