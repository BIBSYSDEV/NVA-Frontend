import deepmerge from 'deepmerge';
import { FieldArrayRenderProps, FormikProps, useFormikContext, move } from 'formik';
import React, { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../redux/actions/notificationActions';
import { Authority } from '../../../types/authority.types';
import { Contributor, emptyContributor, UnverifiedContributor } from '../../../types/contributor.types';
import { NotificationVariant } from '../../../types/notification.types';
import { BackendTypeNames } from '../../../types/publication_types/commonRegistration.types';
import { Registration } from '../../../types/registration.types';
import { overwriteArrayMerge } from '../../../utils/formik-helpers';
import AuthorTable from './components/AuthorTable';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import AddContributorModal from './AddContributorModal';

const StyledAddAuthorButton = styled(Button)`
  margin-top: 1rem;
`;

interface AuthorsProps extends Pick<FieldArrayRenderProps, 'push' | 'replace'> {}

const Authors: FC<AuthorsProps> = ({ push, replace }) => {
  const { t } = useTranslation('registration');
  const dispatch = useDispatch();
  const { values, setValues }: FormikProps<Registration> = useFormikContext();
  const {
    entityDescription: { contributors },
  } = values;
  const [openContributorModal, setOpenContributorModal] = useState(false);
  const [unverifiedContributor, setUnverifiedContributor] = useState<UnverifiedContributor | null>(null);
  const orderedContributors = [...contributors].map((contributor, index) => ({ ...contributor, sequence: index + 1 }));

  const toggleContributorModal = () => {
    if (unverifiedContributor) {
      setUnverifiedContributor(null);
    }
    setOpenContributorModal(!openContributorModal);
  };

  useEffect(() => {
    if (unverifiedContributor) {
      // Open modal if user has selected a unverified contributor
      setOpenContributorModal(true);
    }
  }, [unverifiedContributor]);

  const handleOnRemove = (indexToRemove: number) => {
    const remainingContributors = [...contributors]
      .filter((_, index) => index !== indexToRemove)
      .map((contributor, index) => ({ ...contributor, sequence: index + 1 }));
    setValues(
      deepmerge(
        values,
        { entityDescription: { contributors: remainingContributors } },
        { arrayMerge: overwriteArrayMerge }
      )
    );
  };

  const handleMoveCard = (newIndex: number, oldIndex: number) => {
    const reorderedContributors = move(orderedContributors, oldIndex, newIndex) as Contributor[];
    // Ensure incrementing sequence values
    const newContributors = reorderedContributors.map((contributor, index) => ({
      ...contributor,
      sequence: index + 1,
    }));
    setValues(
      deepmerge(values, { entityDescription: { contributors: newContributors } }, { arrayMerge: overwriteArrayMerge })
    );
  };

  const onAuthorSelected = (authority: Authority) => {
    if (orderedContributors.some((contributor) => contributor.identity.arpId === authority.systemControlNumber)) {
      dispatch(setNotification(t('contributors.author_already_added'), NotificationVariant.Info));
      return;
    }

    const identity = {
      ...emptyContributor.identity,
      arpId: authority.systemControlNumber,
      orcId: authority.orcids.length > 0 ? authority.orcids[0] : '',
      name: authority.name,
    };

    if (!unverifiedContributor) {
      const newContributor: Contributor = {
        ...emptyContributor,
        identity,
        affiliations: authority.orgunitids.map((unitUri) => ({
          type: BackendTypeNames.ORGANIZATION,
          id: unitUri,
        })),
        sequence: orderedContributors.length + 1,
      };
      push(newContributor);
    } else {
      const verifiedContributor: Contributor = {
        ...orderedContributors[unverifiedContributor.index],
        identity,
      };
      replace(unverifiedContributor.index, verifiedContributor);
    }
  };

  return (
    <>
      <AuthorTable
        authors={orderedContributors}
        onDelete={handleOnRemove}
        onMoveAuthor={handleMoveCard}
        setUnverifiedAuthor={setUnverifiedContributor}
      />
      <StyledAddAuthorButton
        onClick={toggleContributorModal}
        variant="contained"
        color="primary"
        data-testid="add-contributor">
        <AddIcon />
        {t('contributors.add_author')}
      </StyledAddAuthorButton>
      <AddContributorModal
        initialSearchTerm={unverifiedContributor?.name}
        open={openContributorModal}
        toggleModal={toggleContributorModal}
        onAuthorSelected={onAuthorSelected}
      />
    </>
  );
};

export default Authors;
