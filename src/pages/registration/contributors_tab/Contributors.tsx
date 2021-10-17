import { FieldArrayRenderProps, move, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, ThemeProvider, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import { Pagination } from '@mui/material';
import { setNotification } from '../../../redux/actions/notificationActions';
import { Authority } from '../../../types/authority.types';
import {
  Contributor,
  ContributorRole,
  emptyContributor,
  Identity,
  Institution,
  UnverifiedContributor,
} from '../../../types/contributor.types';
import { NotificationVariant } from '../../../types/notification.types';
import { ContributorFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import { useIsMobile } from '../../../utils/hooks/useIsMobile';
import { lightTheme, paginationTranslationProps } from '../../../themes/lightTheme';
import { ContributorList } from './components/ContributorList';
import { AddContributorModal } from './AddContributorModal';
import { getAddContributorText, getContributorHeading } from '../../../utils/translation-helpers';

const StyledButton = styled(Button)`
  margin: 1rem 0rem;
  border-radius: 1rem;
`;

const StyledPagination = styled(Pagination)`
  margin-top: 1rem;
  > ul {
    justify-content: center;
  }
`;

interface ContributorsProps extends Pick<FieldArrayRenderProps, 'push' | 'replace'> {
  contributorRoles: ContributorRole[];
}

const contributorsPerPage = 5;

export const Contributors = ({ contributorRoles, push, replace }: ContributorsProps) => {
  const { t } = useTranslation('registration');
  const dispatch = useDispatch();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [openContributorModal, setOpenContributorModal] = useState(false);
  const [unverifiedContributor, setUnverifiedContributor] = useState<UnverifiedContributor | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination pages are 1-indexed :/
  const isMobile = useIsMobile();

  const contributors = values.entityDescription?.contributors ?? [];
  const relevantContributors = contributors.filter((contributor) =>
    contributorRoles.some((role) => role === contributor.role)
  );
  const contributorsToShow = relevantContributors.slice(
    contributorsPerPage * (currentPage - 1),
    contributorsPerPage * currentPage
  );
  const otherContributors = contributors.filter(
    (contributor) => !contributorRoles.some((role) => role === contributor.role)
  );

  const handleOnRemove = (indexToRemove: number) => {
    const nextRelevantContributors = relevantContributors
      .filter((_, index) => index !== indexToRemove)
      .map((contributor, index) => ({ ...contributor, sequence: index + 1 }));
    const nextContributors = [...nextRelevantContributors, ...otherContributors];
    setFieldValue(ContributorFieldNames.Contributors, nextContributors);

    const maxValidPage = Math.ceil(nextContributors.length / contributorsPerPage);
    if (currentPage > maxValidPage) {
      setCurrentPage(maxValidPage);
    }

    if (nextContributors.length === 0) {
      // Ensure field is set to touched even if it's empty
      setFieldTouched(ContributorFieldNames.Contributors);
    }
  };

  const handleMoveContributor = (newSequence: number, oldSequence: number) => {
    const oldIndex = relevantContributors.findIndex((c) => c.sequence === oldSequence);
    const minNewIndex = 0;
    const maxNewIndex = relevantContributors.length - 1;

    const newIndex =
      newSequence - 1 > maxNewIndex
        ? maxNewIndex
        : newSequence < minNewIndex
        ? minNewIndex
        : relevantContributors.findIndex((c) => c.sequence === newSequence);

    const orderedContributors =
      newIndex >= 0 ? (move(relevantContributors, oldIndex, newIndex) as Contributor[]) : relevantContributors;

    // Ensure incrementing sequence values
    const newContributors = orderedContributors.map((contributor, index) => ({
      ...contributor,
      sequence: index + 1,
    }));
    setFieldValue(ContributorFieldNames.Contributors, [...otherContributors, ...newContributors]);
  };

  const handleOpenContributorModal = (unverifiedContributor: UnverifiedContributor) => {
    setUnverifiedContributor(unverifiedContributor);
    setOpenContributorModal(true);
  };

  const onContributorSelected = (authority: Authority, role: ContributorRole) => {
    if (relevantContributors.some((contributor) => contributor.identity.id === authority.id)) {
      dispatch(setNotification(t('contributors.contributor_already_added'), NotificationVariant.Info));
      return;
    }

    const identity: Identity = {
      type: 'Identity',
      id: authority.id,
      orcId: authority.orcids.length > 0 ? authority.orcids[0] : '',
      name: authority.name,
    };

    if (!unverifiedContributor) {
      const newContributor: Contributor = {
        ...emptyContributor,
        identity,
        affiliations: authority.orgunitids.map((unitUri) => ({
          type: 'Organization',
          id: unitUri,
        })),
        role,
        sequence: relevantContributors.length + 1,
      };
      push(newContributor);
      const maxValidPage = Math.ceil((relevantContributors.length + 1) / contributorsPerPage);
      setCurrentPage(maxValidPage);
    } else {
      const relevantContributor = relevantContributors[unverifiedContributor.index];
      const relevantAffiliations = relevantContributor.affiliations ?? [];
      const existingOrgunitIds: Institution[] = authority.orgunitids.map((unitUri) => ({
        type: 'Organization',
        id: unitUri,
      }));
      relevantAffiliations.push(...existingOrgunitIds);

      const verifiedContributor: Contributor = {
        ...relevantContributor,
        role,
        identity,
        affiliations: relevantAffiliations,
      };
      replace(unverifiedContributor.index, verifiedContributor);
    }
  };

  const contributorRole = contributorRoles.length === 1 ? contributorRoles[0] : 'OtherContributor';

  const addContributorButton = (
    <StyledButton
      onClick={() => {
        setOpenContributorModal(true);
        setUnverifiedContributor(null);
      }}
      variant="contained"
      color={contributorRoles.length === 1 ? 'secondary' : 'inherit'}
      startIcon={<AddIcon />}
      data-testid={`add-${contributorRole}`}>
      {getAddContributorText(contributorRole)}
    </StyledButton>
  );

  return (
    <div data-testid={contributorRole}>
      <Typography variant="h2">{getContributorHeading(contributorRole)}</Typography>
      <ThemeProvider theme={lightTheme}>
        {((isMobile && contributorsToShow.length >= 2) || (!isMobile && contributorsToShow.length >= 5)) &&
          addContributorButton}

        <ContributorList
          contributors={contributorsToShow}
          onDelete={handleOnRemove}
          onMoveContributor={handleMoveContributor}
          openContributorModal={handleOpenContributorModal}
          showContributorRole={contributorRoles.length > 1}
          contributorsLength={relevantContributors.length}
        />

        <AddContributorModal
          contributorRoles={contributorRoles}
          contributorRole={contributorRole}
          initialSearchTerm={unverifiedContributor?.name}
          open={openContributorModal}
          toggleModal={() => setOpenContributorModal(!openContributorModal)}
          onContributorSelected={onContributorSelected}
        />
      </ThemeProvider>
      {relevantContributors.length > contributorsPerPage && (
        <StyledPagination
          variant="outlined"
          color="primary"
          size="large"
          shape="rounded"
          getItemAriaLabel={paginationTranslationProps}
          onChange={(_, page) => setCurrentPage(page)}
          page={currentPage}
          count={Math.ceil(relevantContributors.length / contributorsPerPage)}
        />
      )}
      {addContributorButton}
    </div>
  );
};
