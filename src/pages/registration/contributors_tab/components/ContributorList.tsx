import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { Contributor, UnverifiedContributor } from '../../../../types/contributor.types';
import { ContributorCard } from './ContributorCard';

interface ContributorListProps {
  contributors: Contributor[];
  onDelete: (index: number) => void;
  onMoveContributor: (newSequence: number, oldSequence: number) => void;
  openContributorModal: (unverifiedContributor: UnverifiedContributor) => void;
}

export const ContributorList = ({
  contributors,
  onDelete,
  onMoveContributor,
  openContributorModal,
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
          contributor={contributor}
          key={contributor.identity.id || contributor.identity.name}
          onMoveContributor={onMoveContributor}
          onRemoveContributorClick={() => setContributorToRemove(contributor)}
          openContributorModal={openContributorModal}
        />
      ))}
      {contributorToRemove && (
        <ConfirmDialog
          open={!!contributorToRemove}
          title={t('contributors.confirm_remove_author_title')}
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
