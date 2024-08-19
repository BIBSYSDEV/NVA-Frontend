import { Typography } from '@mui/material';
import { HTMLAttributes } from 'react';
import { Category } from '../types/vocabulary.types';
import { getLanguageString } from '../utils/translation-helpers';

interface HrcsActivityOptionProps {
  props: HTMLAttributes<HTMLLIElement>;
  option: Category;
}

export const HrcsActivityOption = ({ props, option }: HrcsActivityOptionProps) => {
  const indentsCount = option.cristinIdentifier.split('.').length - 1;
  return (
    <li {...props}>
      <Typography sx={{ pl: `${indentsCount * 1.5}rem`, fontWeight: indentsCount === 0 ? 500 : 400 }}>
        {getLanguageString(option.label)}
      </Typography>
    </li>
  );
};
