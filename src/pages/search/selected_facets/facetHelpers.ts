import { TFunction } from 'i18next';
import { LanguageString } from '../../../types/common.types';
import { getLanguageString } from '../../../utils/translation-helpers';

export const getSelectedFacetsArray = (searchParams: URLSearchParams, relevantParams: string[]) =>
  Array.from(searchParams).flatMap(([param, value]) =>
    value
      .split(',')
      .map((thisValue) => ({ param, value: thisValue }))
      .filter(({ param }) => relevantParams.includes(param))
  );

export const getSectorValueContent = (t: TFunction, value: string, labels?: LanguageString) => {
  const sectorName = getLanguageString(labels);
  if (sectorName) {
    return sectorName;
  } else {
    if (value === 'UC') {
      return t('basic_data.institutions.sector_values.UHI');
    } else {
      return t(`basic_data.institutions.sector_values.${value}`, { defaultValue: value });
    }
  }
};
