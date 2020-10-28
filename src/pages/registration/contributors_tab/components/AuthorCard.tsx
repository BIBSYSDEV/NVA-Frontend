import {
  TableRow,
  TableCell,
  TextField,
  Typography,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Button,
} from '@material-ui/core';
import { useFormikContext, FieldProps, Field } from 'formik';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Contributor, UnverifiedContributor } from '../../../../types/contributor.types';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import AffiliationsCell from './AffiliationsCell';
import WarningIcon from '@material-ui/icons/Warning';
import CheckIcon from '@material-ui/icons/Check';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from 'styled-components';

const StyledWarningIcon = styled(WarningIcon)`
  color: ${({ theme }) => theme.palette.warning.main};
`;

const StyledCheckIcon = styled(CheckIcon)`
  color: ${({ theme }) => theme.palette.success.main};
`;

const StyledEmailTextField = styled(TextField)`
  margin-bottom: 0.5rem;
`;

interface AuthorCardProps {
  author: Contributor;
  onMoveAuthor: (event: React.ChangeEvent<any>) => void;
  onRemoveAuthorClick: () => void;
  openContributorModal: (unverifiedAuthor: UnverifiedContributor) => void;
}

const AuthorCard: FC<AuthorCardProps> = ({ author, onMoveAuthor, onRemoveAuthorClick, openContributorModal }) => {
  const { t } = useTranslation('registration');
  const index = author.sequence - 1;
  const baseFieldName = `${ContributorFieldNames.CONTRIBUTORS}[${index}]`;
  const { values, setFieldValue } = useFormikContext<Registration>();
  const [emailValue, setEmailValue] = useState(values.entityDescription.contributors[index]?.email ?? '');

  return (
    <TableRow tabIndex={0} key={author.identity.id}>
      <TableCell align="left">
        <Field name={`${baseFieldName}.${SpecificContributorFieldNames.SEQUENCE}`}>
          {({ field }: FieldProps) => (
            <TextField
              {...field}
              type="number"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && field.value) {
                  event.preventDefault();
                  onMoveAuthor(event);
                }
              }}
              onBlur={(event) => {
                onMoveAuthor(event);
                field.onBlur(event);
              }}
            />
          )}
        </Field>
        <Typography variant="h5">
          {author.identity.name}{' '}
          {author.identity.arpId ? (
            <Tooltip title={t('contributors.known_author_identity') as string}>
              <StyledCheckIcon />
            </Tooltip>
          ) : (
            <Tooltip title={t('contributors.unknown_author_identity') as string}>
              <StyledWarningIcon />
            </Tooltip>
          )}
        </Typography>

        <Field name={`${baseFieldName}.${SpecificContributorFieldNames.CORRESPONDING}`}>
          {({ field }: FieldProps) => (
            <FormControlLabel
              data-testid="author-corresponding-checkbox"
              control={<Checkbox checked={!!field.value} {...field} />}
              label={t('contributors.corresponding')}
            />
          )}
        </Field>
        <div>
          {author.correspondingAuthor && (
            <Field name={`${baseFieldName}.${SpecificContributorFieldNames.EMAIL}`}>
              {({ field, meta: { error, touched } }: FieldProps) => (
                <StyledEmailTextField
                  data-testid="author-email-input"
                  variant="outlined"
                  label={t('common:email')}
                  {...field}
                  onChange={(event) => {
                    setEmailValue(event.target.value);
                  }}
                  onBlur={(event) => {
                    setFieldValue(`${baseFieldName}.${SpecificContributorFieldNames.EMAIL}`, emailValue);
                    field.onBlur(event);
                  }}
                  value={emailValue}
                  error={touched && !!error}
                  helperText={touched && error}
                />
              )}
            </Field>
          )}
        </div>

        {!author.identity.arpId && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            data-testid={`button-set-unverified-contributor-${author.identity.name}`}
            onClick={() => openContributorModal({ name: author.identity.name, index })}>
            {t('contributors.connect_author_identity')}
          </Button>
        )}
      </TableCell>
      <TableCell align="left">
        {author.identity && <AffiliationsCell affiliations={author.affiliations} baseFieldName={baseFieldName} />}
      </TableCell>
      <TableCell align="right">
        <Button
          color="secondary"
          variant="contained"
          size="small"
          data-testid={`button-remove-contributor-${author.identity.name}`}
          onClick={onRemoveAuthorClick}>
          <DeleteIcon />
          {t('contributors.remove_contributor')}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AuthorCard;
