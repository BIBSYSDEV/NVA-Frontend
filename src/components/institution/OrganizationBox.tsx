import { Box, BoxProps, styled, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { DeleteIconButton } from '../../pages/messages/components/DeleteIconButton';
import { EditIconButton } from '../../pages/messages/components/EditIconButton';
import { EditAffiliationModal } from '../../pages/registration/contributors_tab/components/EditAffiliationModal';
import { Affiliation } from '../../types/contributor.types';
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
  canEdit?: boolean;
  baseFieldName?: string;
  affiliations?: Affiliation[];
  authorName?: string;
  removeAffiliation?: () => void;
}

export const OrganizationBox = ({
  unitUri,
  canEdit = false,
  authorName,
  affiliations,
  baseFieldName,
  removeAffiliation,
  sx,
}: OrganizationBoxProps) => {
  const { t } = useTranslation();
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const organizationQuery = useFetchOrganization(unitUri);

  const toggleEditModal = () => setEditModalIsOpen(!editModalIsOpen);

  return organizationQuery.isPending ? (
    <AffiliationSkeleton />
  ) : organizationQuery.data ? (
    <StyledOrganizationBox sx={sx}>
      <OrganizationHierarchy organization={organizationQuery.data} />
      {canEdit && baseFieldName && (
        <>
          <EditIconButton
            data-testid={dataTestId.registrationWizard.contributors.editAffiliationButton}
            onClick={() => setEditModalIsOpen(true)}
            tooltip={t('registration.contributors.edit_affiliation')}
          />
          <EditAffiliationModal
            affiliationToEdit={organizationQuery.data}
            affiliationModalIsOpen={editModalIsOpen}
            toggleAffiliationModal={toggleEditModal}
            authorName={authorName}
            affiliations={affiliations}
            baseFieldName={baseFieldName}
          />
        </>
      )}
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
