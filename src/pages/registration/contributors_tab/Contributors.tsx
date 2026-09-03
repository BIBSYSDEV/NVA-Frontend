import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import MailOutlineIcon from '@mui/icons-material/MailOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { FieldArrayRenderProps, useFormikContext } from 'formik';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ListPagination } from '../../../components/ListPagination';
import { RegistrationFormContext } from '../../../context/RegistrationFormContext';
import { setNotification } from '../../../redux/notificationSlice';
import {
  Affiliation,
  Contributor,
  ContributorRole,
  emptyContributor,
  Identity,
} from '../../../types/contributor.types';
import { ContributorFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import { CristinPerson } from '../../../types/user.types';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import {
  appendContributor,
  getContributorsInSequenceOrder,
  getIdentityKey,
  getOtherRolesOfContributor,
  hasIdentityWithRole,
  moveContributorToSequence,
  renumberSequences,
} from '../../../utils/contributor-helpers';
import { dataTestId } from '../../../utils/dataTestIds';
import {
  filterActiveAffiliations,
  getFullCristinName,
  getOrcidUri,
  getVerificationStatus,
} from '../../../utils/user-helpers';
import { AddContributorModal } from './AddContributorModal';
import { ContributorRow } from './components/ContributorRow';

interface ContributorsProps extends Pick<FieldArrayRenderProps, 'replace'> {
  contributorRoles: ContributorRole[];
}

export const Contributors = ({ contributorRoles, replace }: ContributorsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [openAddContributor, setOpenAddContributor] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterInput, setFilterInput] = useState('');

  const { disableNviCriticalFields, disableChannelClaimsFields } = useContext(RegistrationFormContext);

  const contributors = values.entityDescription?.contributors ?? [];

  const orderedContributors = getContributorsInSequenceOrder(contributors);
  const filteredEntries = !filterInput
    ? orderedContributors
    : orderedContributors.filter((entry) =>
        entry.contributor.identity.name.toLocaleLowerCase().includes(filterInput.toLocaleLowerCase())
      );
  const entriesToShow = filteredEntries.slice(rowsPerPage * (currentPage - 1), rowsPerPage * currentPage);

  const handleOnRemove = (indexToRemove: number) => {
    const nextContributors = renumberSequences(contributors.filter((_, index) => index !== indexToRemove));
    setFieldValue(ContributorFieldNames.Contributors, nextContributors);
    const maxValidPage = Math.ceil(nextContributors.length / rowsPerPage);

    if (currentPage > maxValidPage) {
      setCurrentPage(maxValidPage);
    }

    if (nextContributors.length === 0) {
      // Ensure field is set to touched even if it's empty
      setFieldTouched(ContributorFieldNames.Contributors);
    }
  };

  const handleMoveContributor = (newSequence: number, oldSequence: number) => {
    setFieldValue(
      ContributorFieldNames.Contributors,
      moveContributorToSequence(contributors, oldSequence, newSequence)
    );
  };

  /**
   * A person can have several roles, but not the same role twice. Pass indexToIgnore when replacing an
   * existing contributor, so it is not compared against itself.
   */
  const notifyIfDuplicateRole = (identity: Identity, role?: ContributorRole, indexToIgnore?: number) => {
    const otherContributors =
      indexToIgnore === undefined ? contributors : contributors.filter((_, index) => index !== indexToIgnore);

    if (!role || !hasIdentityWithRole(otherContributors, getIdentityKey(identity.id), role)) {
      return false;
    }

    dispatch(
      setNotification({
        message: t('registration.contributors.contributor_already_added_with_same_role'),
        variant: 'info',
      })
    );
    return true;
  };

  const addContributor = (newContributor: Contributor) => {
    setFieldValue(ContributorFieldNames.Contributors, appendContributor(contributors, newContributor));
    // The contributor is added last, so show the page it ended up on
    setCurrentPage(Math.floor(contributors.length / rowsPerPage) + 1);
  };

  const onContributorSelected = (
    selectedContributor: CristinPerson,
    role: ContributorRole,
    contributorIndex?: number
  ) => {
    const identity: Identity = {
      type: 'Identity',
      id: selectedContributor.id,
      name: getFullCristinName(selectedContributor.names),
      orcId: getOrcidUri(selectedContributor.identifiers),
      verificationStatus: getVerificationStatus(selectedContributor.verified),
    };

    // When verifying an existing contributor it keeps its own role, which must not collide with the
    // roles the identified person already has
    const roleToAdd = contributorIndex === undefined ? role : contributors[contributorIndex].role?.type;

    if (notifyIfDuplicateRole(identity, roleToAdd, contributorIndex)) {
      return;
    }

    const activeAffiliations = filterActiveAffiliations(selectedContributor.affiliations);
    const existingAffiliations: Affiliation[] = activeAffiliations.map(({ organization }) => ({
      type: 'Organization',
      id: organization,
    }));

    if (contributorIndex === undefined) {
      addContributor({
        ...emptyContributor,
        identity,
        affiliations: existingAffiliations,
        role: {
          type: role,
        },
      });
    } else {
      const thisContributor = contributors[contributorIndex];
      const verifiedAffiliations = thisContributor.affiliations ? [...thisContributor.affiliations] : [];
      const verifiedOrcid = thisContributor.identity.orcId;

      verifiedAffiliations.push(...existingAffiliations);

      const verifiedContributor: Contributor = {
        ...thisContributor,
        identity: {
          ...identity,
          orcId: verifiedOrcid || identity.orcId || '',
          additionalIdentifiers: thisContributor.identity.additionalIdentifiers,
        },
        affiliations: verifiedAffiliations,
      };
      replace(contributorIndex, verifiedContributor);
    }
  };

  return (
    <>
      {contributors.length > 5 && (
        <TextField
          data-testid={dataTestId.registrationWizard.contributors.contributorSearchField}
          type="search"
          sx={{ display: 'block', mb: '1rem' }}
          label={t('common.search_by_name')}
          variant="filled"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          onChange={(event) => {
            setCurrentPage(1);
            setFilterInput(event.target.value);
          }}
        />
      )}

      {entriesToShow.length > 0 && (
        <ListPagination
          count={filteredEntries.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={(newPage) => setCurrentPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setCurrentPage(1);
          }}>
          <TableContainer sx={{ mb: '0.5rem' }} component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('common.order')}</TableCell>
                  <TableCell>{t('common.role')}</TableCell>
                  <TableCell align="center">
                    <Tooltip title={t('registration.contributors.corresponding')}>
                      <MailOutlineIcon />
                    </Tooltip>
                  </TableCell>
                  <TableCell>{t('common.name')}</TableCell>
                  <TableCell>{t('common.affiliation')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entriesToShow.map(({ contributor, index }) => (
                  <ContributorRow
                    // The identity must be part of the key: on a plain index, removing a row makes React
                    // reuse that row for the next contributor, keeping the previous one's sequence input
                    // and the search term of its "identify contributor" dialog
                    key={`${getIdentityKey(contributor.identity.id) || contributor.identity.name}-${index}`}
                    contributor={contributor}
                    onMoveContributor={handleMoveContributor}
                    onRemoveContributor={handleOnRemove}
                    onVerifyContributor={onContributorSelected}
                    isLastElement={contributors.length === contributor.sequence}
                    contributorRoles={contributorRoles}
                    contributorIndex={index}
                    otherRolesOfContributor={getOtherRolesOfContributor(contributors, index)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ListPagination>
      )}

      <AddContributorModal
        contributorRoles={contributorRoles}
        open={openAddContributor}
        toggleModal={() => setOpenAddContributor(false)}
        onContributorSelected={onContributorSelected}
        addUnverifiedContributor={(contributor) => {
          if (!notifyIfDuplicateRole(contributor.identity, contributor.role?.type)) {
            addContributor(contributor);
          }
        }}
      />

      <Button
        disabled={disableNviCriticalFields || disableChannelClaimsFields}
        sx={{ marginBottom: '1rem', borderRadius: '1rem' }}
        onClick={() => setOpenAddContributor(true)}
        variant="contained"
        color="tertiary"
        startIcon={<AddIcon />}
        data-testid={dataTestId.registrationWizard.contributors.addContributorButton}>
        {t('registration.contributors.add_contributor')}
      </Button>
    </>
  );
};
