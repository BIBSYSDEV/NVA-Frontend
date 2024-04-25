import { Box, Chip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam, TicketSearchParam } from '../api/searchApi';
import { CategoryFilterDialog } from '../pages/search/advanced_search/CategoryFilterDialog';
import { PublicationInstanceType } from '../types/registration.types';
import { CategoryChip } from './CategorySelector';

interface CategorySearchFilterProps {
  searchParam: ResultParam | TicketSearchParam;
}

export const CategorySearchFilter = ({ searchParam }: CategorySearchFilterProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const [openCategoryFilter, setOpenCategoryFilter] = useState(false);
  const toggleCategoryFilter = () => setOpenCategoryFilter(!openCategoryFilter);

  const selectedCategories = (params.get(searchParam)?.split(',') as PublicationInstanceType[] | null) ?? [];

  return (
    <section>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
        {selectedCategories.slice(0, 3).map((category) => (
          <CategoryChip
            key={category}
            category={{
              value: category,
              text: t(`registration.publication_types.${category}`),
              selected: true,
            }}
            onClickChip={toggleCategoryFilter}
          />
        ))}
        {selectedCategories.length > 3 ? (
          <Chip
            label={t('common.x_others', { count: selectedCategories.length - 3 })}
            variant="filled"
            color="primary"
            onClick={toggleCategoryFilter}
          />
        ) : (
          <Chip
            label={t('registration.resource_type.select_resource_type')}
            color="primary"
            onClick={toggleCategoryFilter}
          />
        )}
      </Box>
      <CategoryFilterDialog
        open={openCategoryFilter}
        currentCategories={selectedCategories}
        closeDialog={toggleCategoryFilter}
        searchParam={searchParam}
      />
    </section>
  );
};
