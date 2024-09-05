import { BoxProps, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { AffiliationSkeleton } from '../../components/institution/AffiliationSkeleton';
import { StyledOrganizationBox } from '../../components/institution/OrganizationBox';
import { OrganizationHierarchy } from '../../components/institution/OrganizationHierarchy';
import { ProjectContributorRole } from '../../types/project.types';
import { dataTestId } from '../../utils/dataTestIds';
import { DeleteIconButton } from '../messages/components/DeleteIconButton';
import { EditIconButton } from '../messages/components/EditIconButton';
import { ProjectEditAffiliationModal } from './ProjectEditAffiliationModal';

interface ProjectOrganizationBoxProps extends Pick<BoxProps, 'sx'> {
  baseFieldName: string;
  authorName: string;
  removeAffiliation?: () => void;
  unitUri: string;
  contributorRoles: ProjectContributorRole[];
  disabledTooltip?: string;
  asProjectManager?: boolean;
}

export const ProjectOrganizationBox = ({
  unitUri,
  authorName,
  baseFieldName,
  removeAffiliation,
  disabledTooltip,
  contributorRoles,
  asProjectManager = false,
  sx,
}: ProjectOrganizationBoxProps) => {
  const { t } = useTranslation();
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const organizationQuery = useFetchOrganization(unitUri);

  const toggleEditModal = () => setEditModalIsOpen(!editModalIsOpen);

  return organizationQuery.isPending ? (
    <AffiliationSkeleton />
  ) : organizationQuery.data ? (
    <StyledOrganizationBox sx={sx}>
      <OrganizationHierarchy organization={organizationQuery.data} />
      {baseFieldName && (
        <>
          <EditIconButton
            data-testid={dataTestId.registrationWizard.contributors.removeAffiliationButton}
            onClick={() => setEditModalIsOpen(true)}
            tooltip={t('registration.contributors.edit_affiliation')}
          />
          <ProjectEditAffiliationModal
            affiliationModalIsOpen={editModalIsOpen}
            toggleAffiliationModal={toggleEditModal}
            authorName={authorName}
            preselectedOrganization={organizationQuery.data}
            baseFieldName={baseFieldName}
            contributorRoles={contributorRoles}
            asProjectManager={asProjectManager}
          />
        </>
      )}
      <DeleteIconButton
        data-testid={dataTestId.registrationWizard.contributors.removeAffiliationButton}
        onClick={removeAffiliation}
        disabled={!removeAffiliation}
        tooltip={!removeAffiliation ? disabledTooltip : t('project.affiliation_modal.delete_affiliation')}
      />
    </StyledOrganizationBox>
  ) : (
    <Typography sx={{ fontStyle: 'italic' }}>
      [{t('feedback.error.get_affiliation_name', { unitUri, interpolation: { escapeValue: false } })}]
    </Typography>
  );
};
