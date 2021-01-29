import { FieldArrayRenderProps, move, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutlineSharp';
import { setNotification } from '../../../redux/actions/notificationActions';
import lightTheme from '../../../themes/lightTheme';
import { Authority } from '../../../types/authority.types';
import { Contributor, emptyContributor, Identity, UnverifiedContributor } from '../../../types/contributor.types';
import { NotificationVariant } from '../../../types/notification.types';
import { BackendTypeNames } from '../../../types/publication_types/commonRegistration.types';
import { ContributorFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import AddContributorModal from './AddContributorModal';
import AuthorList from './components/AuthorList';

const StyledButton = styled(Button)`
  margin: 1rem 0rem;
`;

type AuthorsProps = Pick<FieldArrayRenderProps, 'push' | 'replace'>;

const Authors = ({ push, replace }: AuthorsProps) => {
  const { t } = useTranslation('registration');
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext<Registration>();
  const {
    entityDescription: { contributors },
  } = values;
  const [openContributorModal, setOpenContributorModal] = useState(false);
  const [unverifiedAuthor, setUnverifiedAuthor] = useState<UnverifiedContributor | null>(null);
  const orderedAuthors = contributors.map((contributor, index) => ({ ...contributor, sequence: index + 1 }));

  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width < lightTheme.breakpoints.values.md;
  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (orderedAuthors.some((author) => author.identity.id === authority.id)) {
      dispatch(setNotification(t('contributors.author_already_added'), NotificationVariant.Info));
      return;
    }

    const identity: Identity = {
      type: BackendTypeNames.IDENTITY,
      id: authority.id,
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
      {((isMobile && contributors.length >= 2) || (!isMobile && contributors.length >= 5)) && (
        <StyledButton
          onClick={() => {
            setOpenContributorModal(true);
            setUnverifiedAuthor(null);
          }}
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          data-testid="add-contributor">
          {t('contributors.add_author')}
        </StyledButton>
      )}
      <AuthorList
        authors={orderedAuthors}
        onDelete={handleOnRemove}
        onMoveAuthor={handleMoveAuthor}
        openContributorModal={handleOpenContributorModal}
      />
      <StyledButton
        onClick={() => {
          setOpenContributorModal(true);
          setUnverifiedAuthor(null);
        }}
        variant="contained"
        color="secondary"
        startIcon={<AddIcon />}
        data-testid="add-contributor">
        {t('contributors.add_author')}
      </StyledButton>
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
