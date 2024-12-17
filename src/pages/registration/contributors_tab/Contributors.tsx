import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
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
import { FieldArrayRenderProps, move, useFormikContext } from 'formik';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ListPagination } from '../../../components/ListPagination';
import { NviCandidateContext } from '../../../context/NviCandidateContext';
import { setNotification } from '../../../redux/notificationSlice';
import { alternatingTableRowColor } from '../../../themes/mainTheme';
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
import { dataTestId } from '../../../utils/dataTestIds';
import {
  filterActiveAffiliations,
  getFullCristinName,
  getOrcidUri,
  getVerificationStatus,
} from '../../../utils/user-helpers';
import { AddContributorModal } from './AddContributorModal';
import { ContributorRow } from './components/ContributorRow';

interface ContributorsProps extends Pick<FieldArrayRenderProps, 'push' | 'replace'> {
  contributorRoles: ContributorRole[];
}

export const Contributors = ({ contributorRoles, push, replace }: ContributorsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [openAddContributor, setOpenAddContributor] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterInput, setFilterInput] = useState('');

  const { disableNviCriticalFields } = useContext(NviCandidateContext);

  const contributors = values.entityDescription?.contributors ?? [];

  const filteredContributors = !filterInput
    ? contributors
    : contributors.filter((contributor) =>
        contributor.identity.name.toLocaleLowerCase().includes(filterInput.toLocaleLowerCase())
      );
  const contributorsToShow = filteredContributors.slice(rowsPerPage * (currentPage - 1), rowsPerPage * currentPage);

  const handleOnRemove = (indexToRemove: number) => {
    const nextContributors = contributors
      .filter((_, index) => index !== indexToRemove)
      .map((contributor, index) => ({ ...contributor, sequence: index + 1 }));
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
    const oldIndex = contributors.findIndex((c) => c.sequence === oldSequence);
    const minNewIndex = 0;
    const maxNewIndex = contributors.length - 1;

    const newIndex =
      newSequence - 1 > maxNewIndex
        ? maxNewIndex
        : newSequence < minNewIndex
          ? minNewIndex
          : contributors.findIndex((c) => c.sequence === newSequence);

    const orderedContributors =
      newIndex >= 0 ? (move(contributors, oldIndex, newIndex) as Contributor[]) : contributors;

    // Ensure incrementing sequence values
    const newContributors = orderedContributors.map((contributor, index) => ({
      ...contributor,
      sequence: index + 1,
    }));
    setFieldValue(ContributorFieldNames.Contributors, newContributors);
  };

  const goToLastPage = () => {
    const maxValidPage = Math.floor(contributors.length / rowsPerPage) + 1;
    setCurrentPage(maxValidPage);
  };

  const onContributorSelected = (
    selectedContributor: CristinPerson,
    role: ContributorRole,
    contributorIndex?: number
  ) => {
    if (contributors.some((contributor) => contributor.identity.id === selectedContributor.id)) {
      dispatch(
        setNotification({
          message: t('registration.contributors.contributor_already_added'),
          variant: 'info',
        })
      );
      return;
    }

    const identity: Identity = {
      type: 'Identity',
      id: selectedContributor.id,
      name: getFullCristinName(selectedContributor.names),
      orcId: getOrcidUri(selectedContributor.identifiers),
      verificationStatus: getVerificationStatus(selectedContributor.verified),
    };

    const activeAffiliations = filterActiveAffiliations(selectedContributor.affiliations);
    const existingAffiliations: Affiliation[] = activeAffiliations.map(({ organization }) => ({
      type: 'Organization',
      id: organization,
    }));

    if (contributorIndex === undefined) {
      const newContributor: Contributor = {
        ...emptyContributor,
        identity,
        affiliations: existingAffiliations,
        role: {
          type: role,
        },
        sequence: contributors.length + 1,
      };
      push(newContributor);
      goToLastPage();
    } else {
      const thisContributor = contributors[contributorIndex];
      const verifiedAffiliations = thisContributor.affiliations ?? [];
      const verifiedOrcid = thisContributor.identity.orcId;

      verifiedAffiliations.push(...existingAffiliations);

      const verifiedContributor: Contributor = {
        ...thisContributor,
        role: {
          type: role,
        },
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

      {contributorsToShow.length > 0 && (
        <ListPagination
          count={filteredContributors.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={(newPage) => setCurrentPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setCurrentPage(1);
          }}>
          <TableContainer sx={{ mb: '0.5rem' }} component={Paper}>
            <Table size="small" sx={alternatingTableRowColor}>
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
                {contributorsToShow.map((contributor, index) => {
                  const contributorIndex = contributors.findIndex(
                    (c) =>
                      c.identity.id === contributor.identity.id &&
                      c.identity.name === contributor.identity.name &&
                      c.role === contributor.role
                  );
                  return (
                    <ContributorRow
                      key={`${contributor.identity.name}${index}`}
                      contributor={contributor}
                      onMoveContributor={handleMoveContributor}
                      onRemoveContributor={handleOnRemove}
                      onVerifyContributor={onContributorSelected}
                      isLastElement={contributors.length === contributor.sequence}
                      contributorRoles={contributorRoles}
                      contributorIndex={contributorIndex}
                    />
                  );
                })}
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
          contributor.sequence = contributors.length + 1;
          push(contributor);
          goToLastPage();
        }}
      />

      <Button
        disabled={disableNviCriticalFields}
        sx={{ marginBottom: '1rem', borderRadius: '1rem' }}
        onClick={() => setOpenAddContributor(true)}
        variant="contained"
        startIcon={<AddIcon />}
        data-testid={dataTestId.registrationWizard.contributors.addContributorButton}>
        {t('registration.contributors.add_contributor')}
      </Button>
    </>
  );
};
