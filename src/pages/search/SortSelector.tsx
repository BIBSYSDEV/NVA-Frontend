import { TextField, MenuItem } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { SearchFieldName } from '../../types/search.types';
import { dataTestId } from '../../utils/dataTestIds';

const StyledTextField = styled(TextField)`
  margin-top: 0;
  grid-area: sorting;
`;

enum SortOption {
  PublishedDateDesc,
  PublishedDateAsc,
  ModifiedDateDesc,
}

const sortOptions = [
  { value: SortOption.PublishedDateDesc, i18nKey: 'sort_by_published_date_desc' },
  { value: SortOption.PublishedDateAsc, i18nKey: 'sort_by_published_date_asc' },
  { value: SortOption.ModifiedDateDesc, i18nKey: 'sort_by_modified_date' },
];

export const SortSelector = () => {
  const history = useHistory();
  const { t } = useTranslation('search');
  const params = new URLSearchParams(history.location.search);

  const selectedSortingValue =
    params.get('orderBy') === SearchFieldName.PublishedDate
      ? params.get('sortOrder') === 'desc'
        ? SortOption.PublishedDateDesc
        : SortOption.PublishedDateAsc
      : SortOption.ModifiedDateDesc;

  const updateSortQuery = (event: ChangeEvent<any>) => {
    const { value } = event.target;

    switch (value) {
      case SortOption.PublishedDateDesc:
        params.set('orderBy', SearchFieldName.PublishedDate);
        params.set('sortOrder', 'desc');
        break;
      case SortOption.PublishedDateAsc:
        params.set('orderBy', SearchFieldName.PublishedDate);
        params.set('sortOrder', 'asc');
        break;
      case SortOption.ModifiedDateDesc:
        params.set('orderBy', SearchFieldName.ModifiedDate);
        params.set('sortOrder', 'desc');
        break;
    }
    history.push({ search: params.toString() });
  };

  return (
    <StyledTextField
      data-testid={dataTestId.startPage.orderBySelect}
      select
      value={selectedSortingValue}
      label={t('sort_by')}
      variant="outlined"
      fullWidth
      onChange={updateSortQuery}>
      {sortOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {t(option.i18nKey)}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};
