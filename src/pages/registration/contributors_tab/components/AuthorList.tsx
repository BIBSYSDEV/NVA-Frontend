import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import ConfirmDialog from '../../../../components/ConfirmDialog';
import { Contributor, UnverifiedContributor } from '../../../../types/contributor.types';
import AuthorCard from './AuthorCard';

interface AuthorListProps {
  authors: Contributor[];
  onDelete: (index: number) => void;
  onMoveAuthor: (newSequence: number, oldSequence: number) => void;
  openContributorModal: (unverifiedAuthor: UnverifiedContributor) => void;
}

const AuthorList = ({ authors, onDelete, onMoveAuthor, openContributorModal }: AuthorListProps) => {
  const { t } = useTranslation('registration');
  const [authorToRemove, setAuthorToRemove] = useState<Contributor | null>(null);

  const closeConfirmDialog = () => {
    setAuthorToRemove(null);
  };

  return (
    <>
      {authors.map((author) => (
        <AuthorCard
          author={author}
          key={author.identity.id || author.identity.name}
          onMoveAuthor={onMoveAuthor}
          onRemoveAuthorClick={() => setAuthorToRemove(author)}
          openContributorModal={openContributorModal}
          contributorsLength={authors.length}
        />
      ))}
      {authorToRemove && (
        <ConfirmDialog
          open={!!authorToRemove}
          title={t('contributors.confirm_remove_author_title')}
          onAccept={() => {
            onDelete(authorToRemove.sequence - 1);
            closeConfirmDialog();
          }}
          onCancel={closeConfirmDialog}
          dataTestId="confirm-remove-author-dialog">
          <Typography>
            {t('contributors.confirm_remove_author_text', {
              contributorName: authorToRemove.identity.name,
            })}
          </Typography>
        </ConfirmDialog>
      )}
    </>
  );
};

export default AuthorList;
