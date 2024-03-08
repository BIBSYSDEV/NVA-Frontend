import { Box, Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ResultParam } from '../../../api/searchApi';

enum ScientificValueLevels {
  LevelZero = 'Unassigned,LevelZero',
  LevelOne = 'LevelOne',
  LevelTwo = 'LevelTwo',
}

export const ScientificValueFilter = () => {
  const [t] = useTranslation();
  const history = useHistory();
  const searchParams = new URLSearchParams(history.location.search);
  const scientificValueParam = searchParams.get(ResultParam.ScientificValue) ?? '';

  const levelZeroSelected = scientificValueParam.includes(ScientificValueLevels.LevelZero);
  const levelOneSelected = scientificValueParam.includes(ScientificValueLevels.LevelOne);
  const levelTwoSelected = scientificValueParam.includes(ScientificValueLevels.LevelTwo);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const newSelectedScientificValues = { levelZeroSelected, levelOneSelected, levelTwoSelected, [name]: checked };

    const scientificValues = [
      newSelectedScientificValues.levelZero ? ScientificValueLevels.LevelZero : '',
      newSelectedScientificValues.levelOne ? ScientificValueLevels.LevelOne : '',
      newSelectedScientificValues.levelTwo ? ScientificValueLevels.LevelTwo : '',
    ]
      .filter(Boolean)
      .join(',');

    if (scientificValues.length > 0) {
      searchParams.set(ResultParam.ScientificValue, scientificValues);
    } else {
      searchParams.delete(ResultParam.ScientificValue);
    }
    history.push({ search: searchParams.toString() });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControlLabel
        control={<Checkbox name="levelZero" checked={levelZeroSelected} onChange={handleChange} />}
        label={t('search.advanced_search.scientific_value.level_zero')}
      />
      <FormControlLabel
        control={<Checkbox name="levelOne" checked={levelOneSelected} onChange={handleChange} />}
        label={t('search.advanced_search.scientific_value.level_one')}
      />
      <FormControlLabel
        control={<Checkbox name="levelTwo" checked={levelTwoSelected} onChange={handleChange} />}
        label={t('search.advanced_search.scientific_value.level_two')}
      />
    </Box>
  );
};
