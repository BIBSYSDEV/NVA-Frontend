import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Box, Skeleton, Typography } from '@mui/material';
import { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { PersonPublisherOption } from './utils/publisher-field-helpers';

interface SelfPublisherOptionProps {
  props: HTMLAttributes<HTMLLIElement>;
  option: PersonPublisherOption;
  isLoading?: boolean;
}

export const SelfPublisherOption = ({ props, option, isLoading = false }: SelfPublisherOptionProps) => {
  const { t } = useTranslation();

  return (
    <li {...props} data-testid={dataTestId.registrationWizard.resourceType.publisherSelfOption}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <PersonOutlineOutlinedIcon aria-hidden />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontWeight: 'bold' }}>
            {isLoading ? <Skeleton sx={{ width: '10rem' }} /> : option.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {isLoading ? (
              <Skeleton sx={{ width: '8rem' }} />
            ) : (
              `${t('common.person_id')}: ${getIdentifierFromId(option.id)}`
            )}
          </Typography>
        </Box>
      </Box>
    </li>
  );
};
