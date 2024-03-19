import { Typography } from '@mui/material';
import { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { Organization } from '../types/organization.types';
import { getLanguageString } from '../utils/translation-helpers';

interface OrganizationRenderOptionProps {
  props: HTMLAttributes<HTMLLIElement>;
  option: Organization;
}

export const OrganizationRenderOption = ({ props, option }: OrganizationRenderOptionProps) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const mainLanguageText = getLanguageString(option.labels);
  const secondaryLanguageText = getLanguageString(
    option.labels,
    currentLanguage === 'nob' || currentLanguage === 'nno' ? 'en' : 'no'
  );

  return (
    <li {...props}>
      <div>
        <Typography fontWeight="bold">{getLanguageString(option.labels)}</Typography>
        <Typography>
          {option.country && `${option.country} | `}
          {mainLanguageText !== secondaryLanguageText && secondaryLanguageText}
        </Typography>
      </div>
    </li>
  );
};
