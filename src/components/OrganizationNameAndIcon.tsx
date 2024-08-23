import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Box, BoxProps, Skeleton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../api/apiPaths';
import { useFetchOrganization } from '../api/hooks/useFetchOrganization';
import { getLanguageString } from '../utils/translation-helpers';

interface OrganizationNameAndIconProps extends Pick<BoxProps, 'sx'> {
  id: string;
  acronym?: boolean;
}

const isOrganizationId = (str: string) => {
  return str && str.includes(CristinApiPath.Organization);
};

export const OrganizationNameAndIcon = ({ id, acronym = false, sx }: OrganizationNameAndIconProps) => {
  const { t } = useTranslation();

  const isValidOrgId = isOrganizationId(id);
  const organizationQuery = useFetchOrganization(isValidOrgId ? id : '');
  const orgName = getLanguageString(organizationQuery.data?.labels);
  const orgAcronym = organizationQuery.data?.acronym;
  // TODO: acronynm always true
  const displayName = isValidOrgId ? orgName : id;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      <AccountBalanceIcon
        color="primary"
        sx={{
          mr: '0.3rem',
          height: '1rem',
          width: '1rem',
        }}
      />
      {organizationQuery.isLoading ? (
        <Skeleton sx={{ width: '2.5rem' }} />
      ) : acronym && orgAcronym ? (
        <Tooltip title={orgName}>
          <Typography>{orgAcronym}</Typography>
        </Tooltip>
      ) : displayName ? (
        <Typography>{displayName}</Typography>
      ) : (
        <Typography>
          <i>{t('common.unknown')}</i>
        </Typography>
      )}
    </Box>
  );
};
