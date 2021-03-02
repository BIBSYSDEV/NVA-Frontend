import { FieldArrayRenderProps, move, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, MuiThemeProvider, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutlineSharp';
import { setNotification } from '../../../redux/actions/notificationActions';
import { Authority } from '../../../types/authority.types';
import {
  Contributor,
  ContributorRole,
  emptyContributor,
  Identity,
  UnverifiedContributor,
} from '../../../types/contributor.types';
import { NotificationVariant } from '../../../types/notification.types';
import { BackendTypeNames } from '../../../types/publication_types/commonRegistration.types';
import { ContributorFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import useIsMobile from '../../../utils/hooks/useIsMobile';
import {
  getAddContributorText,
  getContributorHeading,
} from '../../../utils/validation/registration/contributorTranslations';
import AddContributorModal from './AddContributorModal';
import lightTheme from '../../../themes/lightTheme';
import { ContributorList } from './components/ContributorList';

const StyledButton = styled(Button)`
  margin: 1rem 0rem;
  border-radius: 1rem;
`;

interface ContributorsProps extends Pick<FieldArrayRenderProps, 'push' | 'replace'> {
  contributorRole?: ContributorRole;
}

export const Contributors = ({ contributorRole = ContributorRole.CREATOR, push, replace }: ContributorsProps) => {
  const { t } = useTranslation('registration');
  const dispatch = useDispatch();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const {
    entityDescription: { contributors },
  } = values;
  const [openContributorModal, setOpenContributorModal] = useState(false);
  const [unverifiedContributor, setUnverifiedContributor] = useState<UnverifiedContributor | null>(null);
  const isMobile = useIsMobile();

  const relevantContributors = contributors.filter((contributor) => contributor.role === contributorRole);
  const otherContributors = contributors.filter((contributor) => contributor.role !== contributorRole);

  const handleOnRemove = (indexToRemove: number) => {
    const nextRelevantContributors = relevantContributors
      .filter((_, index) => index !== indexToRemove)
      .map((contributor, index) => ({ ...contributor, sequence: index + 1 }));
    const nextContributors = [...nextRelevantContributors, ...otherContributors];
    setFieldValue(ContributorFieldNames.CONTRIBUTORS, nextContributors);

    if (nextContributors.length === 0) {
      // Ensure field is set to touched even if it's empty
      setFieldTouched(ContributorFieldNames.CONTRIBUTORS);
    }
  };

  const handleMoveContributor = (newSequence: number, oldSequence: number) => {
    const oldIndex = relevantContributors.findIndex((c) => c.sequence === oldSequence);
    const minNewIndex = 0;
    const maxNewIndex = relevantContributors.length - 1;

    const boundedNewIndex =
      newSequence > relevantContributors.length ? maxNewIndex : newSequence < 0 ? minNewIndex : null;
    const newIndex = boundedNewIndex
      ? boundedNewIndex
      : Math.min(
          maxNewIndex,
          Math.max(
            minNewIndex,
            relevantContributors.findIndex((c) => c.sequence === newSequence)
          )
        );

    const reorderedContributors = move(relevantContributors, oldIndex, newIndex) as Contributor[];
    // Ensure incrementing sequence values
    const newContributors = reorderedContributors.map((contributor, index) => ({
      ...contributor,
      sequence: index + 1,
    }));
    setFieldValue(ContributorFieldNames.CONTRIBUTORS, [...otherContributors, ...newContributors]);
  };

  const handleOpenContributorModal = (unverifiedAuthor: UnverifiedContributor) => {
    setUnverifiedContributor(unverifiedAuthor);
    setOpenContributorModal(true);
  };

  const onAuthorSelected = (authority: Authority) => {
    if (relevantContributors.some((author) => author.identity.id === authority.id)) {
      dispatch(setNotification(t('contributors.author_already_added'), NotificationVariant.Info));
      return;
    }

    const identity: Identity = {
      type: BackendTypeNames.IDENTITY,
      id: authority.id,
      orcId: authority.orcids.length > 0 ? authority.orcids[0] : '',
      name: authority.name,
    };

    if (!unverifiedContributor) {
      const newAuthor: Contributor = {
        ...emptyContributor,
        identity,
        affiliations: authority.orgunitids.map((unitUri) => ({
          type: BackendTypeNames.ORGANIZATION,
          id: unitUri,
        })),
        role: contributorRole,
        sequence: relevantContributors.length + 1,
      };
      push(newAuthor);
    } else {
      const verifiedAuthor: Contributor = {
        ...relevantContributors[unverifiedContributor.index],
        role: contributorRole,
        identity,
      };
      replace(unverifiedContributor.index, verifiedAuthor);
    }
  };

  return (
    <>
      <Typography variant="h2">{getContributorHeading(contributorRole)}</Typography>
      <MuiThemeProvider theme={lightTheme}>
        {((isMobile && contributors.length >= 2) || (!isMobile && contributors.length >= 5)) && (
          <StyledButton
            onClick={() => {
              setOpenContributorModal(true);
              setUnverifiedContributor(null);
            }}
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            data-testid={`add-contributor-${contributorRole}`}>
            {getAddContributorText(contributorRole)}
          </StyledButton>
        )}

        <ContributorList
          contributors={relevantContributors}
          onDelete={handleOnRemove}
          onMoveContributor={handleMoveContributor}
          openContributorModal={handleOpenContributorModal}
        />

        <StyledButton
          onClick={() => {
            setOpenContributorModal(true);
            setUnverifiedContributor(null);
          }}
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          data-testid={`add-contributor-${contributorRole}`}>
          {getAddContributorText(contributorRole)}
        </StyledButton>
        <AddContributorModal
          contributorRole={contributorRole}
          initialSearchTerm={unverifiedContributor?.name}
          open={openContributorModal}
          toggleModal={() => setOpenContributorModal(!openContributorModal)}
          onAuthorSelected={onAuthorSelected}
        />
      </MuiThemeProvider>
    </>
  );
};
