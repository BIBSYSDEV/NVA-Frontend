import { TextField, Typography, Tooltip, FormControlLabel, Checkbox, Button } from '@material-ui/core';
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
import { StyledRightAlignedWrapper } from '../../../../components/styled/Wrappers';

const StyledWarningIcon = styled(WarningIcon)`
  color: ${({ theme }) => theme.palette.warning.main};
`;

const StyledCheckIcon = styled(CheckIcon)`
  color: ${({ theme }) => theme.palette.success.main};
`;

const StyledAuthorCard = styled.div`
  display: grid;
  grid-template-areas: 'author' 'institution' 'remove-author';
  grid-row-gap: 1rem;
  margin: 1rem;
  background-color: #fff;
  padding: 1rem;
`;

const StyledAuthorSection = styled.div`
  grid-area: author;
  display: grid;
  grid-template-areas: 'name verified sequence' 'corresponding email .';
  grid-template-columns: auto auto 1fr;
  grid-column-gap: 1rem;
  align-items: start;
`;

const StyledSequenceField = styled(Field)`
  grid-area: sequence;
`;

const StyledNameField = styled(Typography)`
  grid-area: name;
`;

const StyledVerifiedSection = styled.div`
  grid-area: verified;
  align-self: center;
`;

const StyledVerifiedButton = styled(Button)`
  padding: 0;
  margin-bottom: 1rem;
  margin-left: 0.5rem;
`;

const StyledCorrespondingField = styled(Field)`
  grid-area: corresponding;
`;

const StyledEmailField = styled(Field)`
  grid-area: email;
`;

const StyledEmailTextField = styled(TextField)`
  margin-bottom: 0.5rem;
`;

const StyledInstitutionSection = styled.div`
  grid-area: institution;
`;

const StyledRemoveButton = styled(Button)`
  grid-area: remove-author;
`;

interface AuthorCardProps {
  author: Contributor;
  onMoveAuthor: (event: React.ChangeEvent<any>) => void;
  onRemoveAuthorClick: () => void;
  openContributorModal: (unverifiedAuthor: UnverifiedContributor) => void;
}

const AuthorCard: FC<AuthorCardProps> = ({
  author,
  onMoveAuthor: onMoveCard,
  onRemoveAuthorClick,
  openContributorModal,
}) => {
  const { t } = useTranslation('registration');
  const index = author.sequence - 1;
  const baseFieldName = `${ContributorFieldNames.CONTRIBUTORS}[${index}]`;
  const { values, setFieldValue } = useFormikContext<Registration>();
  const [emailValue, setEmailValue] = useState(values.entityDescription.contributors[index]?.email ?? '');

  return (
    <StyledAuthorCard>
      <StyledAuthorSection key={author.identity.id}>
        <StyledRightAlignedWrapper>
          <StyledSequenceField name={`${baseFieldName}.${SpecificContributorFieldNames.SEQUENCE}`}>
            {({ field }: FieldProps) => (
              <TextField
                {...field}
                type="number"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && field.value) {
                    event.preventDefault();
                    onMoveCard(event);
                  }
                }}
                onBlur={(event) => {
                  onMoveCard(event);
                  field.onBlur(event);
                }}
              />
            )}
          </StyledSequenceField>
        </StyledRightAlignedWrapper>
        <StyledNameField variant="h5">{author.identity.name}</StyledNameField>
        <StyledVerifiedSection>
          {author.identity.arpId ? (
            <Tooltip title={t('contributors.known_author_identity') as string}>
              <StyledCheckIcon />
            </Tooltip>
          ) : (
            <Tooltip title={t('contributors.unknown_author_identity') as string}>
              <StyledWarningIcon />
            </Tooltip>
          )}
          {!author.identity.arpId && (
            <StyledVerifiedButton
              color="primary"
              data-testid={`button-set-unverified-contributor-${author.identity.name}`}
              onClick={() => openContributorModal({ name: author.identity.name, index })}>
              {t('contributors.connect_author_identity')}
            </StyledVerifiedButton>
          )}
        </StyledVerifiedSection>
        <StyledCorrespondingField name={`${baseFieldName}.${SpecificContributorFieldNames.CORRESPONDING}`}>
          {({ field }: FieldProps) => (
            <FormControlLabel
              data-testid="author-corresponding-checkbox"
              control={<Checkbox checked={!!field.value} {...field} />}
              label={t('contributors.corresponding')}
            />
          )}
        </StyledCorrespondingField>
        {author.correspondingAuthor && (
          <StyledEmailField name={`${baseFieldName}.${SpecificContributorFieldNames.EMAIL}`}>
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
          </StyledEmailField>
        )}
      </StyledAuthorSection>
      <StyledInstitutionSection>
        {author.identity && <AffiliationsCell affiliations={author.affiliations} baseFieldName={baseFieldName} />}
      </StyledInstitutionSection>
      <StyledRemoveButton
        color="secondary"
        variant="contained"
        size="small"
        data-testid={`button-remove-contributor-${author.identity.name}`}
        onClick={onRemoveAuthorClick}>
        <DeleteIcon />
        {t('contributors.remove_contributor')}
      </StyledRemoveButton>
    </StyledAuthorCard>
  );
};

export default AuthorCard;
