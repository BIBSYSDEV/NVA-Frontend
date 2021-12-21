import { FieldArrayRenderProps, move, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Button,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/AddCircleOutlineSharp';
import { setNotification } from '../../../redux/actions/notificationActions';
import { Authority } from '../../../types/authority.types';
import {
  Contributor,
  ContributorRole,
  emptyContributor,
  Identity,
  Institution,
} from '../../../types/contributor.types';
import { NotificationVariant } from '../../../types/notification.types';
import { ContributorFieldNames } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';
import { AddContributorModal } from './AddContributorModal';
import { ROWS_PER_PAGE_OPTIONS } from '../../../utils/constants';
import { alternatingTableRowColor } from '../../../themes/mainTheme';
import { ContributorRow } from './components/ContributorRow';
import { dataTestId } from '../../../utils/dataTestIds';

interface ContributorsProps extends Pick<FieldArrayRenderProps, 'push' | 'replace'> {
  contributorRoles: ContributorRole[];
}

export const Contributors = ({ contributorRoles, push, replace }: ContributorsProps) => {
  const { t } = useTranslation('registration');
  const dispatch = useDispatch();
  const { values, setFieldValue, setFieldTouched } = useFormikContext<Registration>();
  const [openAddContributor, setOpenAddContributor] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterInput, setFilterInput] = useState('');

  const contributors = values.entityDescription?.contributors ?? [];
  const relevantContributors = contributors.filter((contributor) =>
    contributorRoles.some((role) => role === contributor.role)
  );
  const filteredRelevantContributors = relevantContributors.filter((contributor) =>
    contributor.identity.name.toLocaleLowerCase().includes(filterInput.toLocaleLowerCase())
  );
  const contributorsToShow = filteredRelevantContributors.slice(
    rowsPerPage * currentPage,
    rowsPerPage * (currentPage + 1)
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
    const maxValidPage = Math.ceil(nextRelevantContributors.length / rowsPerPage) - 1;

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

  const onContributorSelected = (authority: Authority, role: ContributorRole, contributorIndex?: number) => {
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

    if (contributorIndex === undefined) {
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
      const maxValidPage = Math.floor(relevantContributors.length / rowsPerPage);
      setCurrentPage(maxValidPage);
    } else {
      const relevantContributor = relevantContributors[contributorIndex];
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
      replace(contributorIndex, verifiedContributor);
    }
  };

  const contributorRole = contributorRoles.length === 1 ? contributorRoles[0] : 'OtherContributor';
  const roleText =
    contributorRole === ContributorRole.Creator
      ? t('registration:contributors.authors')
      : contributorRole === ContributorRole.Editor
      ? t('registration:contributors.editors')
      : contributorRole === ContributorRole.Supervisor
      ? t('registration:contributors.supervisors')
      : t('registration:heading.contributors');

  return (
    <div data-testid={contributorRole}>
      <Typography variant="h2" paragraph>
        {roleText}
      </Typography>

      {relevantContributors.length > 5 && (
        <TextField
          sx={{ mb: '1rem' }}
          label={t('contributors.filter', { role: roleText.toLocaleLowerCase() })}
          variant="filled"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={(event) => {
            setCurrentPage(0);
            setFilterInput(event.target.value);
          }}
        />
      )}

      {contributorsToShow.length > 0 && (
        <TableContainer>
          <Table size="small" sx={alternatingTableRowColor}>
            <TableHead>
              <TableRow>
                <TableCell>{t('common:order')}</TableCell>
                <TableCell>
                  {contributorRoles.length > 1 ? t('common:role') : t('contributors.corresponding')}
                </TableCell>
                <TableCell>{t('contributors.confirmed')}</TableCell>
                <TableCell>{t('common:name')}</TableCell>
                <TableCell>{t('common:institution')}</TableCell>
                <TableCell>{t('common:remove')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contributorsToShow.map((contributor) => {
                const contributorIndex = contributors.findIndex(
                  (c) =>
                    c.identity.id === contributor.identity.id &&
                    c.identity.name === contributor.identity.name &&
                    c.role === contributor.role
                );
                return (
                  <ContributorRow
                    key={`${contributor.identity.name}${contributor.sequence}`}
                    contributor={contributor}
                    onMoveContributor={handleMoveContributor}
                    onRemoveContributor={handleOnRemove}
                    onVerifyContributor={onContributorSelected}
                    isLastElement={relevantContributors.length === contributor.sequence}
                    contributorRoles={contributorRoles}
                    contributorIndex={contributorIndex}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <AddContributorModal
        contributorRoles={contributorRoles}
        contributorRole={contributorRole}
        open={openAddContributor}
        toggleModal={() => setOpenAddContributor(false)}
        onContributorSelected={onContributorSelected}
      />
      {contributorsToShow.length > 0 && (
        <TablePagination
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={filteredRelevantContributors.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={(_, newPage) => setCurrentPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value));
            setCurrentPage(0);
          }}
        />
      )}
      <Button
        sx={{ marginBottom: '1rem', borderRadius: '1rem' }}
        onClick={() => setOpenAddContributor(true)}
        variant="contained"
        color={contributorRoles.length === 1 ? 'primary' : 'inherit'}
        startIcon={<AddIcon />}
        data-testid={dataTestId.registrationWizard.contributors.addContributorButton(contributorRole)}>
        {t('contributors.add_as_role', {
          role:
            contributorRole === 'OtherContributor'
              ? t('contributors.contributor')
              : t(`contributors.types.${contributorRole}`),
        })}
      </Button>
    </div>
  );
};
