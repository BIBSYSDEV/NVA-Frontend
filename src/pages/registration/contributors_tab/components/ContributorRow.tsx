import { Field, FieldProps } from 'formik';
import { useState } from 'react';
import {
  Box,
  TableRow,
  TableCell,
  Tooltip,
  Typography,
  Checkbox,
  TextField,
  IconButton,
  MenuItem,
  Link,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import { Contributor, ContributorRole } from '../../../../types/contributor.types';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { AffiliationsCell } from './AffiliationsCell';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { AddContributorModal } from '../AddContributorModal';
import { dataTestId } from '../../../../utils/dataTestIds';
import { CristinPerson } from '../../../../types/user.types';
import OrcidLogo from '../../../../resources/images/orcid_logo.svg';
import { ContributorIndicator } from '../ContributorIndicator';

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
    <TableRow>
      <TableCell width="1">
        <Box sx={{ display: 'flex' }}>
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
                sx={{ minWidth: 'auto' }}
                onClick={() => onMoveContributor(contributor.sequence + 1, contributor.sequence)}>
                <ArrowDownwardIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
          {contributor.sequence !== 1 && (
            <Tooltip title={t('common.move_up')}>
              <IconButton
                sx={{ minWidth: 'auto' }}
                onClick={() => onMoveContributor(contributor.sequence - 1, contributor.sequence)}>
                <ArrowUpwardIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </TableCell>
      <TableCell align="left" width="1">
        <Box sx={{ display: 'flex', alignItems: 'end' }}>
          {!contributorRoles.includes(contributor.role) && (
            <Tooltip title={t('registration.contributors.invalid_role')}>
              <WarningIcon color="warning" />
            </Tooltip>
          )}
          <Field name={`${baseFieldName}.${SpecificContributorFieldNames.Role}`}>
            {({ field }: FieldProps<ContributorRole>) => (
              <TextField {...field} select variant="standard" fullWidth>
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
                checked={!!field.value}
                {...field}
                inputProps={{ 'aria-label': t('registration.contributors.corresponding') }}
              />
            </Tooltip>
          )}
        </Field>
      </TableCell>
      <TableCell width="1">
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <ContributorIndicator contributor={contributor} />
        </Box>
      </TableCell>
      <TableCell>
        <Box sx={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
          {contributor.identity.id ? (
            <Typography>{contributor.identity.name}</Typography>
          ) : (
            <Tooltip title={t('registration.contributors.verify_person')}>
              <Typography
                data-testid={dataTestId.registrationWizard.contributors.verifyContributorButton(
                  contributor.identity.name
                )}
                component={Link}
                onClick={() => setOpenVerifyContributor(true)}
                sx={{ cursor: 'pointer' }}>
                {contributor.identity.name}
              </Typography>
            </Tooltip>
          )}
          {contributor.identity.orcId && (
            <Tooltip title={t('common.orcid_profile')}>
              <IconButton size="small" href={contributor.identity.orcId} target="_blank">
                <img src={OrcidLogo} height="20" alt="orcid" />
              </IconButton>
            </Tooltip>
          )}
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
      <TableCell width="1">
        <Tooltip title={t('registration.contributors.remove_contributor')}>
          <IconButton
            data-testid={dataTestId.registrationWizard.contributors.removeContributorButton(contributor.identity.name)}
            onClick={() => setOpenRemoveContributor(true)}>
            <CancelIcon color="error" />
          </IconButton>
        </Tooltip>
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
        open={!!openRemoveContributor}
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
