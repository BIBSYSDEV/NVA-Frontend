import { TableContainer, Table, TableBody, Typography } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { Contributor, UnverifiedContributor } from '../../../../types/contributor.types';
import AuthorCard from './AuthorCard';

interface AuthorTableProps {
  authors: Contributor[];
  onDelete: (index: number) => void;
  onMoveAuthor: (newIndex: number, oldIndex: number) => void;
  setUnverifiedAuthor: (unverifiedAuthor: UnverifiedContributor) => void;
}

const AuthorTable: FC<AuthorTableProps> = ({ authors, onDelete, onMoveAuthor, setUnverifiedAuthor }) => {
  const { t } = useTranslation('registration');
  const [authorToRemove, setAuthorToRemove] = useState<Contributor | null>(null);

  const closeConfirmDialog = () => {
    setAuthorToRemove(null);
  };

  return (
    <TableContainer>
      <Table>
        <TableBody>
          {authors.map((author: Contributor) => (
            <AuthorCard
              author={author}
              key={author.identity.id || author.identity.name}
              onMoveAuthor={(event: React.ChangeEvent<any>) =>
                onMoveAuthor(event.target.value - 1, author.sequence - 1)
              }
              onRemoveAuthorClick={() => setAuthorToRemove(author)}
              setUnverifiedAuthor={setUnverifiedAuthor}
            />
          ))}
        </TableBody>
      </Table>
      {authorToRemove && (
        <ConfirmDialog
          open={!!authorToRemove}
          title={t('contributors.confirm_remove_contributor_title')}
          onAccept={() => {
            onDelete(authorToRemove.sequence - 1);
            closeConfirmDialog();
          }}
          onCancel={closeConfirmDialog}>
          <Typography>
            {t('contributors.confirm_remove_contributor_text', {
              contributorName: authorToRemove.identity.name,
            })}
          </Typography>
        </ConfirmDialog>
      )}
    </TableContainer>
  );
};

export default AuthorTable;
