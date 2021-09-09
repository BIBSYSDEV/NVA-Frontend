import { TextField, MenuItem } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

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
  const [selectedSortOption, setSelectedSortOption] = useState(SortOption.PublishedDateDesc);

  useEffect(() => {
    const params = new URLSearchParams(history.location.search);
    switch (selectedSortOption) {
      case SortOption.PublishedDateDesc:
        params.set('orderBy', 'publishedDate');
        params.set('sortOrder', 'desc');
        break;
      case SortOption.PublishedDateAsc:
        params.set('orderBy', 'publishedDate');
        params.set('sortOrder', 'asc');
        break;
      case SortOption.ModifiedDateDesc:
        params.set('orderBy', 'modifiedDate');
        params.set('sortOrder', 'desc');
        break;
    }
    history.push({ search: params.toString() });
  }, [history, selectedSortOption]);

  return (
    <StyledTextField value={selectedSortOption} select label={t('sort_by')} variant="outlined" fullWidth>
      {sortOptions.map((option) => (
        <MenuItem key={option.value} value={option.value} onClick={() => setSelectedSortOption(option.value)}>
          {t(option.i18nKey)}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};
