import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Box, Typography } from '@mui/material';
import { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { PersonPublisherOption } from './utils/publisher-field-helpers';

interface SelfPublisherOptionProps {
  props: HTMLAttributes<HTMLLIElement>;
  option: PersonPublisherOption;
}

export const SelfPublisherOption = ({ props, option }: SelfPublisherOptionProps) => {
  const { t } = useTranslation();

  return (
    <li {...props} data-testid={dataTestId.registrationWizard.resourceType.publisherSelfOption}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <PersonOutlineOutlinedIcon aria-hidden />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontWeight: 'bold' }}>{option.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {t('common.person_id')}: {getIdentifierFromId(option.id)}
          </Typography>
        </Box>
      </Box>
    </li>
  );
};
