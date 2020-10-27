import { TableContainer, Table, TableBody, Typography } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { Contributor, UnverifiedContributor } from '../../../../types/contributor.types';
import AuthorCard from './AuthorCard';

interface AuthorTableProps {
  contributors: Contributor[];
  onDelete: (index: number) => void;
  onMoveCard: (newIndex: number, oldIndex: number) => void;
  setUnverifiedContributor: (unverifiedContributor: UnverifiedContributor) => void;
}

const AuthorTable: FC<AuthorTableProps> = ({ contributors, onDelete, onMoveCard, setUnverifiedContributor }) => {
  const { t } = useTranslation('registration');
  const [contributorToRemove, setContributorToRemove] = useState<Contributor | null>(null);

  const closeConfirmDialog = () => {
    setContributorToRemove(null);
  };

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {contributors.map((contributor: Contributor, index: number) => (
            <AuthorCard
              contributor={contributor}
              key={contributor.identity.id || contributor.identity.name}
              onMoveCard={(event: React.ChangeEvent<any>) =>
                onMoveCard(event.target.value - 1, contributor.sequence - 1)
              }
              onRemoveContributorClick={() => setContributorToRemove(contributor)}
              setUnverifiedContributor={setUnverifiedContributor}
            />
          ))}
        </TableBody>
      </Table>
      {contributorToRemove && (
        <ConfirmDialog
          open={!!contributorToRemove}
          title={t('contributors.confirm_remove_contributor_title')}
          onAccept={() => {
            onDelete(contributorToRemove.sequence - 1);
            closeConfirmDialog();
          }}
          onCancel={closeConfirmDialog}>
          <Typography>
            {t('contributors.confirm_remove_contributor_text', {
              contributorName: contributorToRemove.identity.name,
            })}
          </Typography>
        </ConfirmDialog>
      )}
    </TableContainer>
  );
};

export default AuthorTable;
