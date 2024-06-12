import { Box, BoxProps, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { DeleteIconButton } from '../../pages/messages/components/DeleteIconButton';
import { EditIconButton } from '../../pages/messages/components/EditIconButton';
import { dataTestId } from '../../utils/dataTestIds';
import { AffiliationSkeleton } from './AffiliationSkeleton';
import { OrganizationHierarchy } from './OrganizationHierarchy';

export const StyledOrganizationBox = styled(Box)({
  border: '1px solid',
  borderRadius: '4px',
  display: 'flex',
  gap: '0.5rem',
  padding: '0.5rem',
  boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.30)',
  backgroundColor: 'white',
});

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
    <StyledOrganizationBox sx={sx}>
      <OrganizationHierarchy organization={organizationQuery.data} />
      <EditIconButton
        data-testid={dataTestId.registrationWizard.contributors.removeAffiliationButton}
        onClick={() => {}}
        tooltip={t('registration.contributors.edit_affiliation')}
      />
      {removeAffiliation && (
        <DeleteIconButton
          data-testid={dataTestId.registrationWizard.contributors.removeAffiliationButton}
          onClick={removeAffiliation}
          tooltip={t('registration.contributors.remove_affiliation')}
        />
      )}
    </StyledOrganizationBox>
  ) : (
    <Typography sx={{ fontStyle: 'italic' }}>
      [{t('feedback.error.get_affiliation_name', { unitUri, interpolation: { escapeValue: false } })}]
    </Typography>
  );
};
