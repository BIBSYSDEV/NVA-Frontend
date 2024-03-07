import { Box, Checkbox, FormControlLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
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
  const scientificValueParam = searchParams.get(ResultParam.ScientificValue) || '';

  const [selectedScientificValues, setSelectedScientificValues] = useState({
    levelZero: scientificValueParam.includes(ScientificValueLevels.LevelZero),
    levelOne: scientificValueParam.includes(ScientificValueLevels.LevelOne),
    levelTwo: scientificValueParam.includes(ScientificValueLevels.LevelTwo),
  });

  // Used to clear value based on URL params
  useEffect(() => {
    setSelectedScientificValues({
      levelZero: scientificValueParam.includes(ScientificValueLevels.LevelZero),
      levelOne: scientificValueParam.includes(ScientificValueLevels.LevelOne),
      levelTwo: scientificValueParam.includes(ScientificValueLevels.LevelTwo),
    });
  }, [scientificValueParam]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const newSelectedScientificValues = { ...selectedScientificValues, [name]: checked };

    setSelectedScientificValues(newSelectedScientificValues);

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
        control={<Checkbox name="levelZero" checked={selectedScientificValues.levelZero} onChange={handleChange} />}
        label={t('search.advanced_search.scientific_value.level_zero')}
      />
      <FormControlLabel
        control={<Checkbox name="levelOne" checked={selectedScientificValues.levelOne} onChange={handleChange} />}
        label={t('search.advanced_search.scientific_value.level_one')}
      />
      <FormControlLabel
        control={<Checkbox name="levelTwo" checked={selectedScientificValues.levelTwo} onChange={handleChange} />}
        label={t('search.advanced_search.scientific_value.level_two')}
      />
    </Box>
  );
};
