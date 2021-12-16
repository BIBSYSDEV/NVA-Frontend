import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { Contributor, UnverifiedContributor } from '../../../../types/contributor.types';
import { ContributorRow } from './ContributorRow';

interface ContributorListProps {
  contributors: Contributor[];
  onDelete: (index: number) => void;
  onMoveContributor: (newSequence: number, oldSequence: number) => void;
  openContributorModal: (unverifiedContributor: UnverifiedContributor) => void;
  contributorsLength?: number; // Can be bigger than contributors.length if parent uses paging
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
      {contributors.length > 0 && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('common:order')}</TableCell>
                <TableCell>{showContributorRole ? t('common:role') : t('contributors.corresponding')}</TableCell>
                <TableCell>{t('contributors.confirmed')}</TableCell>
                <TableCell>{t('common:name')}</TableCell>
                <TableCell>{t('common:institution')}</TableCell>
                <TableCell>{t('common:remove')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contributors.map((contributor, index) => (
                <ContributorRow
                  key={index}
                  contributor={contributor}
                  onMoveContributor={onMoveContributor}
                  onRemoveContributorClick={() => setContributorToRemove(contributor)}
                  openContributorModal={openContributorModal}
                  contributorsLength={contributorsLength}
                  showContributorRole={showContributorRole}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {contributorToRemove && (
        <ConfirmDialog
          open={!!contributorToRemove}
          title={t('contributors.remove_role', {
            role: t(`contributors.types.${contributorToRemove.role}`).toLowerCase(),
          })}
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
