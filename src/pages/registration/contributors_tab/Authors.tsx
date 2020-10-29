import { FieldArrayRenderProps, useFormikContext, move } from 'formik';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationActions';
import { Authority } from '../../../types/authority.types';
import { Contributor, emptyContributor, UnverifiedContributor } from '../../../types/contributor.types';
import { NotificationVariant } from '../../../types/notification.types';
import { BackendTypeNames } from '../../../types/publication_types/commonRegistration.types';
import { Registration } from '../../../types/registration.types';
import AuthorsList from './components/AuthorTable';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import AddContributorModal from './AddContributorModal';
import { ContributorFieldNames } from '../../../types/publicationFieldNames';

const StyledAddAuthorButton = styled(Button)`
  margin-top: 1rem;
`;

interface AuthorsProps extends Pick<FieldArrayRenderProps, 'push' | 'replace'> {}

const Authors: FC<AuthorsProps> = ({ push, replace }) => {
  const { t } = useTranslation('registration');
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext<Registration>();
  const {
    entityDescription: { contributors },
  } = values;
  const [openContributorModal, setOpenContributorModal] = useState(false);
  const [unverifiedAuthor, setUnverifiedAuthor] = useState<UnverifiedContributor | null>(null);
  const orderedAuthors = contributors.map((contributor, index) => ({ ...contributor, sequence: index + 1 }));

  const handleOnRemove = (indexToRemove: number) => {
    const remainingAuthors = contributors
      .filter((_, index) => index !== indexToRemove)
      .map((contributor, index) => ({ ...contributor, sequence: index + 1 }));
    setFieldValue(ContributorFieldNames.CONTRIBUTORS, remainingAuthors);
  };

  const handleMoveAuthor = (newIndex: number, oldIndex: number) => {
    const reorderedAuthors = move(orderedAuthors, oldIndex, newIndex) as Contributor[];
    // Ensure incrementing sequence values
    const newAuthors = reorderedAuthors.map((contributor, index) => ({
      ...contributor,
      sequence: index + 1,
    }));
    setFieldValue(ContributorFieldNames.CONTRIBUTORS, newAuthors);
  };

  const handleOpenContributorModal = (unverifiedAuthor: UnverifiedContributor) => {
    setUnverifiedAuthor(unverifiedAuthor);
    setOpenContributorModal(true);
  };

  const onAuthorSelected = (authority: Authority) => {
    if (orderedAuthors.some((author) => author.identity.arpId === authority.systemControlNumber)) {
      dispatch(setNotification(t('contributors.author_already_added'), NotificationVariant.Info));
      return;
    }

    const identity = {
      ...emptyContributor.identity,
      arpId: authority.systemControlNumber,
      orcId: authority.orcids.length > 0 ? authority.orcids[0] : '',
      name: authority.name,
    };

    if (!unverifiedAuthor) {
      const newAuthor: Contributor = {
        ...emptyContributor,
        identity,
        affiliations: authority.orgunitids.map((unitUri) => ({
          type: BackendTypeNames.ORGANIZATION,
          id: unitUri,
        })),
        sequence: orderedAuthors.length + 1,
      };
      push(newAuthor);
    } else {
      const verifiedAuthor: Contributor = {
        ...orderedAuthors[unverifiedAuthor.index],
        identity,
      };
      replace(unverifiedAuthor.index, verifiedAuthor);
    }
  };

  return (
    <>
      <AuthorsList
        authors={orderedAuthors}
        onDelete={handleOnRemove}
        onMoveAuthor={handleMoveAuthor}
        openContributorModal={handleOpenContributorModal}
      />
      <StyledAddAuthorButton
        onClick={() => {
          setOpenContributorModal(true);
          setUnverifiedAuthor(null);
        }}
        variant="contained"
        color="primary"
        data-testid="add-contributor">
        <AddIcon />
        {t('contributors.add_author')}
      </StyledAddAuthorButton>
      <AddContributorModal
        initialSearchTerm={unverifiedAuthor?.name}
        open={openContributorModal}
        toggleModal={() => setOpenContributorModal(!openContributorModal)}
        onAuthorSelected={onAuthorSelected}
      />
    </>
  );
};

export default Authors;
