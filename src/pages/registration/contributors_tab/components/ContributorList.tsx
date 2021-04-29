import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { Contributor, UnverifiedContributor } from '../../../../types/contributor.types';
import { ContributorCard } from './ContributorCard';
import { getRemoveContributorText } from '../../../../utils/translation-helpers';

interface ContributorListProps {
  contributors: Contributor[];
  onDelete: (index: number) => void;
  onMoveContributor: (newSequence: number, oldSequence: number) => void;
  openContributorModal: (unverifiedContributor: UnverifiedContributor) => void;
  contributorsLength?: number; // Can be different than contributors.length if paging is used
  showContributorRole?: boolean;
}

export const ContributorList = ({
  contributors,
  contributorsLength = contributors.length,
  onDelete,
  onMoveContributor,
  openContributorModal,
  showContributorRole = false,
}: ContributorListProps) => {
  const { t } = useTranslation('registration');
  const [contributorToRemove, setContributorToRemove] = useState<Contributor | null>(null);

  const closeConfirmDialog = () => {
    setContributorToRemove(null);
  };

  return (
    <>
      {contributors.map((contributor) => (
        <ContributorCard
          key={contributor.identity.id || contributor.identity.name}
          contributor={contributor}
          onMoveContributor={onMoveContributor}
          onRemoveContributorClick={() => setContributorToRemove(contributor)}
          openContributorModal={openContributorModal}
          contributorsLength={contributorsLength}
          showContributorRole={showContributorRole}
        />
      ))}
      {contributorToRemove && (
        <ConfirmDialog
          open={!!contributorToRemove}
          title={getRemoveContributorText(contributorToRemove.role)}
          onAccept={() => {
            onDelete(contributorToRemove.sequence - 1);
            closeConfirmDialog();
          }}
          onCancel={closeConfirmDialog}
          dataTestId="confirm-remove-author-dialog">
          <Typography>
            {t('contributors.confirm_remove_author_text', {
              contributorName: contributorToRemove.identity.name,
            })}
          </Typography>
        </ConfirmDialog>
      )}
    </>
  );
};
