import ClearIcon from '@mui/icons-material/Clear';
import { Button } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { removeSearchParamValue, syncParamsWithSearchFields } from '../../../utils/searchHelpers';

interface SelectedFacetButtonProps {
  param: string;
  value: string;
  content: string | ReactNode;
}

export const SelectedFacetButton = ({ param, value, content }: SelectedFacetButtonProps) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <li style={{ listStyleType: 'none' }}>
      <Button
        data-testid={dataTestId.startPage.advancedSearch.removeFacetButton}
        variant="outlined"
        size="small"
        title={t('search.remove_filter')}
        sx={{ textTransform: 'none' }}
        endIcon={<ClearIcon />}
        onClick={() => {
          const syncedParams = syncParamsWithSearchFields(searchParams);
          const newParams = removeSearchParamValue(syncedParams, param, value);
          newParams.delete(ResultParam.From);
          setSearchParams(newParams);
        }}>
        {content}
      </Button>
    </li>
  );
};
