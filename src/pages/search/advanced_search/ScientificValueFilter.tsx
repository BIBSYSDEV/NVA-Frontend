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

  const [values, setValues] = useState({
    levelZero: scientificValueParam.includes(ScientificValueLevels.LevelZero),
    levelOne: scientificValueParam.includes(ScientificValueLevels.LevelOne),
    levelTwo: scientificValueParam.includes(ScientificValueLevels.LevelTwo),
  });

  // Used to clear cvalue based on URL params
  useEffect(() => {
    setValues({
      levelZero: scientificValueParam.includes(ScientificValueLevels.LevelZero),
      levelOne: scientificValueParam.includes(ScientificValueLevels.LevelOne),
      levelTwo: scientificValueParam.includes(ScientificValueLevels.LevelTwo),
    });
  }, [scientificValueParam]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const newValues = { ...values, [name]: checked };

    setValues(newValues);

    const scientificValues = [
      newValues.levelZero ? ScientificValueLevels.LevelZero : '',
      newValues.levelOne ? ScientificValueLevels.LevelOne : '',
      newValues.levelTwo ? ScientificValueLevels.LevelTwo : '',
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
        control={<Checkbox name="levelZero" checked={values.levelZero} onChange={handleChange} />}
        label={t('search.advanced_search.scientific_value.level_zero')}
      />
      <FormControlLabel
        control={<Checkbox name="levelOne" checked={values.levelOne} onChange={handleChange} />}
        label={t('search.advanced_search.scientific_value.level_one')}
      />
      <FormControlLabel
        control={<Checkbox name="levelTwo" checked={values.levelTwo} onChange={handleChange} />}
        label={t('search.advanced_search.scientific_value.level_two')}
      />
    </Box>
  );
};
