import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { DeleteIconButton } from '../../pages/messages/components/DeleteIconButton';
import { dataTestId } from '../../utils/dataTestIds';
import { AffiliationSkeleton } from './AffiliationSkeleton';
import { OrganizationTitle } from './OrganizationTitle';

export const organizationBoxStyle = {
  border: '1px solid',
  borderRadius: '4px',
  display: 'flex',
  p: '0.5rem',
  boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.30)',
  bgcolor: 'white',
};

interface OrganizationBoxProps extends Pick<BoxProps, 'sx'> {
  unitUri: string;
  removeAffiliation?: () => void;
}

export const OrganizationBox = ({ unitUri, sx, removeAffiliation }: OrganizationBoxProps) => {
  const { t } = useTranslation();
  const organizationQuery = useFetchOrganization(unitUri);

  return organizationQuery.isPending ? (
    <AffiliationSkeleton />
  ) : organizationQuery.data ? (
    <Box
      sx={{
        ...organizationBoxStyle,
        ...sx,
      }}>
      <OrganizationTitle organization={organizationQuery.data} />
      {removeAffiliation && (
        <DeleteIconButton
          data-testid={dataTestId.registrationWizard.contributors.removeAffiliationButton}
          onClick={removeAffiliation}
          tooltip={t('registration.contributors.remove_affiliation')}
        />
      )}
    </Box>
  ) : (
    <Typography sx={{ fontStyle: 'italic' }}>
      [{t('feedback.error.get_affiliation_name', { unitUri, interpolation: { escapeValue: false } })}]
    </Typography>
  );
};
