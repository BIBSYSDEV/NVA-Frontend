import { Box, BoxProps, IconButton, Link as MuiLink, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ContributorIndicator } from '../pages/registration/contributors_tab/ContributorIndicator';
import OrcidLogo from '../resources/images/orcid_logo.svg';
import { getResearchProfilePath } from '../utils/urlPaths';

interface ContributorNameProps extends Pick<BoxProps, 'sx'> {
  name: string;
  hasVerifiedAffiliation: boolean;
  id?: string;
  orcId?: string;
}

export const ContributorName = ({ name, hasVerifiedAffiliation, id, orcId, sx }: ContributorNameProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '0.4rem', alignItems: 'center', ...sx }}>
      <ContributorIndicator contributorName={name} contributorId={id} hasVerifiedAffiliation={hasVerifiedAffiliation} />
      {id ? (
        <MuiLink component={Link} to={getResearchProfilePath(id)}>
          {name}
        </MuiLink>
      ) : (
        <Typography>{name}</Typography>
      )}
      {orcId && (
        <Tooltip title={t('common.orcid_profile')}>
          <IconButton size="small" href={orcId} target="_blank">
            <img src={OrcidLogo} height="20" alt="orcid" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
