import { Box, Tooltip, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import OrcidLogo from '../resources/images/orcid_logo.svg';
import { Contributor } from '../types/contributor.types';

interface ContributorIndicatorsProps {
  contributor: Contributor;
}

export const ContributorIndicators = ({
  contributor: {
    identity: { orcId },
    correspondingAuthor,
  },
}: ContributorIndicatorsProps) => {
  const { t } = useTranslation();

  return orcId || correspondingAuthor ? (
    <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
      {orcId && (
        <Tooltip title={t('common.orcid_profile')}>
          <IconButton size="small" href={orcId} target="_blank">
            <img src={OrcidLogo} height="20" alt="orcid" />
          </IconButton>
        </Tooltip>
      )}
      {correspondingAuthor && (
        <Tooltip title={t('registration.contributors.corresponding')}>
          <MailOutlineIcon />
        </Tooltip>
      )}
    </Box>
  ) : null;
};
