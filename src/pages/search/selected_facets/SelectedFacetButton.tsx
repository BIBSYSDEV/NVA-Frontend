import ClearIcon from '@mui/icons-material/Clear';
import { Button } from '@mui/material';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { PersonSearchParameter } from '../../../api/cristinApi';
import { ResultParam } from '../../../api/searchApi';
import { PersonAggregations } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { removeSearchParamValue, syncParamsWithSearchFields } from '../../../utils/searchHelpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { SelectedInstitutionFacetButton } from '../registration_search/RegistrationSearchBar';

interface SelectedFacetButtonProps {
  param: string;
  value: string;
  aggregations?: PersonAggregations;
}

export const SelectedFacetButton = ({ param, value, aggregations }: SelectedFacetButtonProps) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const paramContent = getParamContent(t, param);
  const valueContent = getValueContent(t, param, value, aggregations);

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
        {paramContent}: {valueContent}
      </Button>
    </li>
  );
};

const getParamContent = (t: TFunction, param: string) => {
  switch (param) {
    case PersonSearchParameter.Organization: {
      return t('common.institution');
    }
    case PersonSearchParameter.Sector:
      return t('search.sector');
    default:
      return param || t('common.unknown');
  }
};

const getValueContent = (t: TFunction, param: string, value: string, aggregations?: PersonAggregations) => {
  switch (param) {
    case PersonSearchParameter.Organization: {
      const institutionLabels = aggregations?.organizationFacet?.find((bucket) => bucket.key === value)?.labels;
      const institutionName = getLanguageString(institutionLabels);
      if (institutionName) {
        return institutionName;
      } else {
        const institutionIdentifier = Number.isInteger(+value) ? `${value}.0.0.0` : value;
        return <SelectedInstitutionFacetButton institutionIdentifier={institutionIdentifier} />;
      }
    }
    case PersonSearchParameter.Sector:
      const sectorLabels = aggregations?.sectorFacet?.find((bucket) => bucket.key === value)?.labels;
      const sectorName = getLanguageString(sectorLabels);
      if (sectorName) {
        return sectorName;
      } else {
        if (value === 'UC') {
          return t('basic_data.institutions.sector_values.UHI');
        } else {
          return t(`basic_data.institutions.sector_values.${value}`, { defaultValue: value });
        }
      }
    default:
      return typeof value === 'string' ? value || t('common.unknown') : t('common.unknown');
  }
};
