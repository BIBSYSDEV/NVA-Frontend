import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ErrorIcon from '@mui/icons-material/Error';
import RemoveIcon from '@mui/icons-material/HighlightOff';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Link as MuiLink,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { ContributorName } from '../../../../components/ContributorName';
import { NviCandidateContext } from '../../../../context/NviCandidateContext';
import OrcidLogo from '../../../../resources/images/orcid_logo.svg';
import { Contributor, ContributorRole } from '../../../../types/contributor.types';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { CristinPerson } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { AddContributorModal } from '../AddContributorModal';
import { AffiliationsCell } from './AffiliationsCell';

interface ContributorRowProps {
  contributor: Contributor;
  onMoveContributor: (newSequence: number, oldSequence: number) => void;
  onRemoveContributor: (index: number) => void;
  onVerifyContributor: (selectedContributor: CristinPerson, role: ContributorRole, contributorIndex?: number) => void;
  isLastElement: boolean;
  contributorRoles: ContributorRole[];
  contributorIndex: number;
}

export const ContributorRow = ({
  contributor,
  onMoveContributor,
  onRemoveContributor,
  onVerifyContributor,
  isLastElement,
  contributorRoles,
  contributorIndex,
}: ContributorRowProps) => {
  const { t } = useTranslation();
  const [openRemoveContributor, setOpenRemoveContributor] = useState(false);
  const [openVerifyContributor, setOpenVerifyContributor] = useState(false);

  const { disableNviCriticalFields } = useContext(NviCandidateContext);

  const baseFieldName = `${ContributorFieldNames.Contributors}[${contributorIndex}]`;
  const [sequenceValue, setSequenceValue] = useState(`${contributor.sequence}`);

  const handleOnMoveContributor = () => {
    const sequenceNumber = +sequenceValue;
    if (sequenceValue && !isNaN(sequenceNumber)) {
      onMoveContributor(sequenceNumber, contributor.sequence);
    }
    setSequenceValue(`${contributor.sequence}`);
  };

  return (
    <TableRow sx={{ td: { verticalAlign: 'top' } }}>
      <TableCell width="1">
        <Box sx={{ display: 'flex', gap: '0.2rem' }}>
          <TextField
            sx={{ width: '3.6rem' }}
            value={sequenceValue}
            onChange={(event) => setSequenceValue(event.target.value)}
            variant="filled"
            label={t('common.number_short')}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleOnMoveContributor();
              }
            }}
            onBlur={handleOnMoveContributor}
          />
          {!isLastElement && (
            <Tooltip title={t('common.move_down')}>
              <IconButton
                size="small"
                sx={{ minWidth: 'auto', height: 'fit-content', marginTop: '0.6rem' }}
                onClick={() => onMoveContributor(contributor.sequence + 1, contributor.sequence)}>
                <ArrowDownwardIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
          {contributor.sequence !== 1 && (
            <Tooltip title={t('common.move_up')}>
              <IconButton
                size="small"
                sx={{ minWidth: 'auto', height: 'fit-content', marginTop: '0.6rem' }}
                onClick={() => onMoveContributor(contributor.sequence - 1, contributor.sequence)}>
                <ArrowUpwardIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </TableCell>
      <TableCell align="left" width="1">
        <Box sx={{ display: 'flex', alignItems: 'end' }}>
          {!contributorRoles.includes(contributor.role.type) && (
            <Tooltip title={t('registration.contributors.invalid_role')}>
              <WarningIcon color="warning" />
            </Tooltip>
          )}
          <Field name={`${baseFieldName}.${SpecificContributorFieldNames.RoleType}`}>
            {({ field, meta: { error, touched } }: FieldProps<ContributorRole>) => (
              <TextField
                {...field}
                select
                variant="filled"
                label={t('common.select_role')}
                fullWidth
                error={!!error && touched}
                helperText={<ErrorMessage name={field.name} />}>
                {contributorRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {t(`registration.contributors.types.${role}`)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Field>
        </Box>
      </TableCell>
      <TableCell align="center" width="1">
        <Field name={`${baseFieldName}.${SpecificContributorFieldNames.Corresponding}`}>
          {({ field }: FieldProps<boolean>) => (
            <Tooltip title={t('registration.contributors.corresponding')}>
              <Checkbox
                data-testid={dataTestId.registrationWizard.contributors.correspondingCheckbox}
                checked={field.value}
                sx={{ marginTop: '0.3rem' }}
                {...field}
                inputProps={{ 'aria-label': t('registration.contributors.corresponding') }}
              />
            </Tooltip>
          )}
        </Field>
      </TableCell>
      <TableCell>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            alignItems: 'start',
            paddingY: '0.5rem',
          }}>
          {!contributor.identity.id && (
            <Box sx={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              <ErrorIcon color="warning" />
              <Typography fontWeight="bold">{t('registration.contributors.contributor_is_unidentified')}</Typography>
            </Box>
          )}
          <ContributorName
            id={contributor.identity.id}
            name={contributor.identity.name}
            hasVerifiedAffiliation={
              !!contributor.affiliations &&
              contributor.affiliations?.some((affiliation) => affiliation.type === 'Organization')
            }
          />
          {!contributor.identity.id && (
            <Button
              disabled={disableNviCriticalFields}
              variant="outlined"
              sx={{ padding: '0.1rem 0.75rem' }}
              data-testid={dataTestId.registrationWizard.contributors.verifyContributorButton(
                contributor.identity.name
              )}
              startIcon={<SearchIcon />}
              onClick={() => setOpenVerifyContributor(true)}>
              {t('registration.contributors.verify_contributor')}
            </Button>
          )}

          <Button
            disabled={disableNviCriticalFields}
            size="small"
            data-testid={dataTestId.registrationWizard.contributors.removeContributorButton(contributor.identity.name)}
            onClick={() => setOpenRemoveContributor(true)}
            startIcon={<RemoveIcon />}>
            {t('registration.contributors.remove_contributor')}
          </Button>
        </Box>
      </TableCell>
      <TableCell sx={{ maxWidth: '25rem' }}>
        {contributor.identity && (
          <AffiliationsCell
            affiliations={contributor.affiliations}
            authorName={contributor.identity.name}
            baseFieldName={baseFieldName}
          />
        )}
      </TableCell>

      {/* Verify contributor */}
      <AddContributorModal
        contributorRoles={contributorRoles}
        initialSearchTerm={contributor.identity.name}
        open={openVerifyContributor}
        toggleModal={() => setOpenVerifyContributor(false)}
        onContributorSelected={(selectedContributor, role) =>
          onVerifyContributor(selectedContributor, role, contributorIndex)
        }
      />

      {/* Remove contributor */}
      <ConfirmDialog
        open={openRemoveContributor}
        title={t('registration.contributors.remove_contributor')}
        onAccept={() => {
          onRemoveContributor(contributor.sequence - 1);
          setOpenRemoveContributor(false);
        }}
        onCancel={() => setOpenRemoveContributor(false)}
        dialogDataTestId="confirm-remove-author-dialog">
        <Typography>
          {t('registration.contributors.confirm_remove_author_text', {
            contributorName: contributor.identity.name,
          })}
        </Typography>
      </ConfirmDialog>
    </TableRow>
  );
};
