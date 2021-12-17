import { Field, FieldProps, useFormikContext } from 'formik';
import { useState, useEffect } from 'react';
import { Box, TableRow, TableCell, Tooltip, Typography, Checkbox, TextField, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CheckIcon from '@mui/icons-material/CheckCircleSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { Contributor, UnverifiedContributor } from '../../../../types/contributor.types';
import { Registration } from '../../../../types/registration.types';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { AffiliationsCell } from './AffiliationsCell';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';

interface ContributorRowProps {
  contributor: Contributor;
  onMoveContributor: (newSequence: number, oldSequence: number) => void;
  onRemoveContributor: (index: number) => void;
  openContributorModal: (unverifiedContributor: UnverifiedContributor) => void;
  contributorsLength: number;
  showContributorRole: boolean;
}

export const ContributorRow = ({
  contributor,
  onMoveContributor,
  onRemoveContributor,
  openContributorModal,
  contributorsLength,
  showContributorRole,
}: ContributorRowProps) => {
  const { t } = useTranslation('registration');
  const {
    values: { entityDescription },
  } = useFormikContext<Registration>();
  const [removeContributor, setRemoveContributor] = useState(false);

  const contributors = entityDescription?.contributors ?? [];
  const contributorIndex = contributors.findIndex(
    (c) =>
      c.identity.id === contributor.identity.id &&
      c.identity.name === contributor.identity.name &&
      c.role === contributor.role
  );
  const baseFieldName = `${ContributorFieldNames.Contributors}[${contributorIndex}]`;
  const [sequenceValue, setSequenceValue] = useState(`${contributor.sequence}`);

  useEffect(() => {
    // Ensure sequence field is updated
    setSequenceValue(`${contributor.sequence}`);
  }, [contributor.sequence]);

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
            label={t('common:number_short')}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleOnMoveContributor();
              }
            }}
            onBlur={handleOnMoveContributor}
          />
          {contributor.sequence < contributorsLength && (
            <Tooltip title={t<string>('common:move_down')}>
              <IconButton
                sx={{ minWidth: 'auto' }}
                onClick={() => onMoveContributor(contributor.sequence + 1, contributor.sequence)}>
                <ArrowDownwardIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
          {contributor.sequence !== 1 && (
            <Tooltip title={t<string>('common:move_up')}>
              <IconButton
                sx={{ minWidth: 'auto' }}
                onClick={() => onMoveContributor(contributor.sequence - 1, contributor.sequence)}>
                <ArrowUpwardIcon color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </TableCell>
      <TableCell align={showContributorRole ? 'left' : 'center'} width="1">
        {showContributorRole ? (
          <Typography>{t(`contributors.types.${contributor.role}`)}</Typography>
        ) : (
          <Field name={`${baseFieldName}.${SpecificContributorFieldNames.Corresponding}`}>
            {({ field }: FieldProps) => (
              <Tooltip title={t<string>('contributors.corresponding')}>
                <Checkbox
                  data-testid="author-corresponding-checkbox"
                  checked={!!field.value}
                  {...field}
                  inputProps={{ 'aria-label': t('contributors.corresponding') }}
                />
              </Tooltip>
            )}
          </Field>
        )}
      </TableCell>
      <TableCell align="center" width="1">
        {contributor.identity.id ? (
          <Tooltip title={t<string>('contributors.known_author_identity')}>
            <CheckIcon color="primary" />
          </Tooltip>
        ) : (
          <Tooltip title={t<string>('contributors.verify_person')}>
            <IconButton
              data-testid={`button-set-unverified-contributor-${contributor.identity.name}`}
              onClick={() => openContributorModal({ name: contributor.identity.name, index: contributorIndex })}>
              <WarningIcon color="warning" />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
      <TableCell>
        <Typography>{contributor.identity.name}</Typography>
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
        <Tooltip title={t<string>('contributors.remove_role', { role: t(`contributors.types.${contributor.role}`) })}>
          <IconButton
            data-testid={`button-remove-contributor-${contributor.identity.name}`}
            onClick={() => setRemoveContributor(true)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Tooltip>
      </TableCell>

      <ConfirmDialog
        open={!!removeContributor}
        title={t('contributors.remove_role', {
          role: t(`contributors.types.${contributor.role}`).toLowerCase(),
        })}
        onAccept={() => {
          onRemoveContributor(contributor.sequence - 1);
          setRemoveContributor(false);
        }}
        onCancel={() => setRemoveContributor(false)}
        dataTestId="confirm-remove-author-dialog">
        <Typography>
          {t('contributors.confirm_remove_author_text', {
            contributorName: contributor.identity.name,
          })}
        </Typography>
      </ConfirmDialog>
    </TableRow>
  );
};
