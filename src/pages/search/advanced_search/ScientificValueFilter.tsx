import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import { StyledFilterHeading } from '../../../components/styled/Wrappers';
import { dataTestId } from '../../../utils/dataTestIds';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

export enum ScientificValueLevels {
  Unassigned = 'Unassigned',
  LevelZero = 'LevelZero',
  LevelOne = 'LevelOne',
  LevelTwo = 'LevelTwo',
}

enum ScientificValueFilterMode {
  UnassignedAndZero = 'UnassignedAndZero',
  OneAndTwo = 'OneAndTwo',
  All = 'All',
}

enum CorrectionListType {
  ApplicableCategoriesWithNonApplicableChannel = 'ApplicableCategoriesWithNonApplicableChannel',
  NonApplicableCategoriesWithApplicableChannel = 'NonApplicableCategoriesWithApplicableChannel',
}

const getScientificValueFilterModeFromParams = (searchParams: URLSearchParams): ScientificValueFilterMode => {
  const listParam = searchParams.get('list') as CorrectionListType | null;

  switch (listParam) {
    case CorrectionListType.ApplicableCategoriesWithNonApplicableChannel:
      return ScientificValueFilterMode.UnassignedAndZero;

    case CorrectionListType.NonApplicableCategoriesWithApplicableChannel:
      return ScientificValueFilterMode.OneAndTwo;

    default:
      return ScientificValueFilterMode.All;
  }
};

export const ScientificValueFilter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = getScientificValueFilterModeFromParams(searchParams);
  const scientificValueParam = searchParams.get(ResultParam.ScientificValue) ?? '';

  const selectedScientificValues = {
    unassigned: scientificValueParam.includes(ScientificValueLevels.Unassigned),
    levelZero: scientificValueParam.includes(ScientificValueLevels.LevelZero),
    levelOne: scientificValueParam.includes(ScientificValueLevels.LevelOne),
    levelTwo: scientificValueParam.includes(ScientificValueLevels.LevelTwo),
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as keyof typeof selectedScientificValues;
    const newSelectedScientificValues = {
      ...selectedScientificValues,
      [name]: !selectedScientificValues[name],
    };

    const scientificValues = [
      newSelectedScientificValues.unassigned ? ScientificValueLevels.Unassigned : '',
      newSelectedScientificValues.levelZero ? ScientificValueLevels.LevelZero : '',
      newSelectedScientificValues.levelOne ? ScientificValueLevels.LevelOne : '',
      newSelectedScientificValues.levelTwo ? ScientificValueLevels.LevelTwo : '',
    ]
      .filter(Boolean)
      .join(',');

    const syncedParams = syncParamsWithSearchFields(searchParams);

    if (scientificValues.length > 0) {
      syncedParams.set(ResultParam.ScientificValue, scientificValues);
    } else {
      syncedParams.delete(ResultParam.ScientificValue);
    }
    syncedParams.delete(ResultParam.From);
    navigate({ search: syncedParams.toString() });
  };

  const checkboxConfigs = [
    {
      key: 'unassigned' as const,
      shouldShow: mode === ScientificValueFilterMode.UnassignedAndZero || mode === ScientificValueFilterMode.All,
      label: t('search.advanced_search.scientific_value.unassigned'),
      testId: dataTestId.startPage.advancedSearch.scientificValueLevels.unassignedCheckbox,
    },
    {
      key: 'levelZero' as const,
      shouldShow: mode === ScientificValueFilterMode.UnassignedAndZero || mode === ScientificValueFilterMode.All,
      label: t('search.advanced_search.scientific_value.level', { level: 0 }),
      testId: dataTestId.startPage.advancedSearch.scientificValueLevels.levelZeroCheckbox,
    },
    {
      key: 'levelOne' as const,
      shouldShow: mode === ScientificValueFilterMode.OneAndTwo || mode === ScientificValueFilterMode.All,
      label: t('search.advanced_search.scientific_value.level', { level: 1 }),
      testId: dataTestId.startPage.advancedSearch.scientificValueLevels.levelOneCheckbox,
    },
    {
      key: 'levelTwo' as const,
      shouldShow: mode === ScientificValueFilterMode.OneAndTwo || mode === ScientificValueFilterMode.All,
      label: t('search.advanced_search.scientific_value.level', { level: 2 }),
      testId: dataTestId.startPage.advancedSearch.scientificValueLevels.levelTwoCheckbox,
    },
  ];

  return (
    <section>
      <StyledFilterHeading>{t('registration.resource_type.level')}</StyledFilterHeading>
      <FormGroup row onChange={handleChange} sx={{ justifySelf: 'center' }}>
        {checkboxConfigs
          .filter((config) => config.shouldShow)
          .map((config) => (
            <FormControlLabel
              key={config.key}
              data-testid={config.testId}
              control={<Checkbox name={config.key} checked={selectedScientificValues[config.key]} />}
              label={config.label}
            />
          ))}
      </FormGroup>
    </section>
  );
};
