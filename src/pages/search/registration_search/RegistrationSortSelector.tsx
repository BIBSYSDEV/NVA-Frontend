import { TextField, MenuItem } from '@mui/material';
import { TFuncKey } from 'i18next';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { RegistrationFieldName } from '../../../types/publicationFieldNames';
import { dataTestId } from '../../../utils/dataTestIds';
import { SearchParam } from '../../../utils/searchHelpers';

enum SortOptionValue {
  PublishedDateDesc,
  PublishedDateAsc,
  ModifiedDateDesc,
}

export const RegistrationSortSelector = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const params = new URLSearchParams(history.location.search);

  const selectedSortingValue =
    params.get(SearchParam.OrderBy) === RegistrationFieldName.PublishedDate
      ? params.get(SearchParam.SortOrder) === 'desc'
        ? SortOptionValue.PublishedDateDesc
        : SortOptionValue.PublishedDateAsc
      : SortOptionValue.ModifiedDateDesc;

  const updateSortQuery = (event: ChangeEvent<any>) => {
    const { value } = event.target;

    switch (value) {
      case SortOptionValue.PublishedDateDesc:
        params.set(SearchParam.OrderBy, RegistrationFieldName.PublishedDate);
        params.set(SearchParam.SortOrder, 'desc');
        break;
      case SortOptionValue.PublishedDateAsc:
        params.set(SearchParam.OrderBy, RegistrationFieldName.PublishedDate);
        params.set(SearchParam.SortOrder, 'asc');
        break;
      case SortOptionValue.ModifiedDateDesc:
        params.set(SearchParam.OrderBy, RegistrationFieldName.ModifiedDate);
        params.set(SearchParam.SortOrder, 'desc');
        break;
    }
    history.push({ search: params.toString() });
  };

  return (
    <TextField
      sx={{ gridArea: 'sorting' }}
      data-testid={dataTestId.startPage.orderBySelect}
      select
      value={selectedSortingValue}
      label={t('search.sort_by')}
      variant="outlined"
      fullWidth
      onChange={updateSortQuery}>
      <MenuItem value={SortOptionValue.PublishedDateDesc}>{t('search.sort_by_published_date_desc')}</MenuItem>
      <MenuItem value={SortOptionValue.PublishedDateAsc}>{t('search.sort_by_published_date_asc')}</MenuItem>
      <MenuItem value={SortOptionValue.ModifiedDateDesc}>{t('search.sort_by_modified_date')}</MenuItem>

      {/* {sortOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {t(option.i18nKey)}
        </MenuItem>
      ))} */}
    </TextField>
  );
};
