import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { ResultParam } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { syncParamsWithSearchFields } from '../../../utils/searchHelpers';

export enum ScientificValueLevels {
  LevelZero = 'Unassigned,LevelZero',
  LevelOne = 'LevelOne',
  LevelTwo = 'LevelTwo',
}

export const ScientificValueFilter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const scientificValueParam = searchParams.get(ResultParam.ScientificValue) ?? '';

  const selectedScientificValues = {
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

  return (
    <FormGroup row onChange={handleChange}>
      <FormControlLabel
        data-testid={dataTestId.startPage.advancedSearch.scientificValueLevels.levelZeroCheckbox}
        control={<Checkbox name="levelZero" checked={selectedScientificValues.levelZero} />}
        label={t('search.advanced_search.scientific_value.level', { level: 0 })}
      />
      <FormControlLabel
        data-testid={dataTestId.startPage.advancedSearch.scientificValueLevels.levelOneCheckbox}
        control={<Checkbox name="levelOne" checked={selectedScientificValues.levelOne} />}
        label={t('search.advanced_search.scientific_value.level', { level: 1 })}
      />
      <FormControlLabel
        data-testid={dataTestId.startPage.advancedSearch.scientificValueLevels.levelTwoCheckbox}
        control={<Checkbox name="levelTwo" checked={selectedScientificValues.levelTwo} />}
        label={t('search.advanced_search.scientific_value.level', { level: 2 })}
      />
    </FormGroup>
  );
};
