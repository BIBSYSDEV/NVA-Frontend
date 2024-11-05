import { Box, Chip } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam, TicketSearchParam } from '../api/searchApi';
import { CategoryFilterDialog } from '../pages/search/advanced_search/CategoryFilterDialog';
import { PublicationInstanceType } from '../types/registration.types';
import { dataTestId } from '../utils/dataTestIds';
import { CategoryChip } from './CategorySelector';
import { StyledFilterHeading } from './styled/Wrappers';

interface CategorySearchFilterProps {
  searchParam: ResultParam.CategoryShould | TicketSearchParam.PublicationType;
  disabled?: boolean;
  hideHeading?: boolean;
}

export const CategorySearchFilter = ({ searchParam, disabled, hideHeading }: CategorySearchFilterProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const [openCategoryFilter, setOpenCategoryFilter] = useState(false);
  const toggleCategoryFilter = () => setOpenCategoryFilter(!openCategoryFilter);

  const selectedCategories = (params.get(searchParam)?.split(',') as PublicationInstanceType[] | null) ?? [];

  return (
    <section>
      {!hideHeading && <StyledFilterHeading>{t('common.category')}</StyledFilterHeading>}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
        {selectedCategories.slice(0, 3).map((category) => (
          <CategoryChip
            key={category}
            disabled={disabled}
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
            disabled={disabled}
            label={t('common.x_others', { count: selectedCategories.length - 3 })}
            variant="filled"
            color="primary"
            onClick={toggleCategoryFilter}
          />
        ) : (
          <Chip
            data-testid={dataTestId.startPage.advancedSearch.selectCategoryChip}
            disabled={disabled}
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
