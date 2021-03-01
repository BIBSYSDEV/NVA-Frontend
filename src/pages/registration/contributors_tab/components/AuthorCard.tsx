import { Field, FieldProps, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Checkbox, FormControlLabel, TextField, Tooltip, Typography } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import CheckIcon from '@material-ui/icons/CheckCircleSharp';
import DeleteIcon from '@material-ui/icons/RemoveCircleSharp';
import WarningIcon from '@material-ui/icons/Warning';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import DangerButton from '../../../../components/DangerButton';
import { StyledRightAlignedWrapper } from '../../../../components/styled/Wrappers';
import lightTheme from '../../../../themes/lightTheme';
import { Contributor, UnverifiedContributor } from '../../../../types/contributor.types';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import AffiliationsCell from './AffiliationsCell';

const StyledCheckIcon = styled(CheckIcon)`
  color: ${({ theme }) => theme.palette.success.main};
`;

const StyledBackgroundDiv = styled(BackgroundDiv)`
  display: grid;
  grid-template-areas: 'author author' 'affiliation affiliation' 'add-affiliation remove-author';
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'author' 'affiliation' 'add-affiliation' 'remove-author';
  }
  margin-top: 1rem;
`;

const StyledAuthorSection = styled.div`
  grid-area: author;
  display: grid;
  grid-template-areas: 'name verified sequence' 'corresponding . .';
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'name sequence' 'verified verified' 'corresponding corresponding';
    grid-template-columns: auto 1fr;
    grid-column-gap: 0;
  }
  grid-template-columns: auto auto 1fr;
  grid-column-gap: 1rem;
  align-items: start;
`;

// const StyledSequenceField = styled(Field)``;

const StyledSequenceTextField = styled(TextField)`
  grid-area: sequence;
  width: 3rem;
  margin: -1rem 1rem 0 0;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    margin: -1rem 0 0 1rem;
  }
`;

const StyledNameField = styled(Typography)`
  grid-area: name;
  font-weight: bold;
`;

const StyledVerifiedSection = styled.div`
  grid-area: verified;
  display: flex;
  align-items: center;
`;

const StyledCorrespondingWrapper = styled.div`
  grid-area: corresponding;
  display: grid;
  grid-template-areas: 'checkbox' 'email';
`;

const StyledCorrespondingField = styled(Field)`
  grid-area: checkbox;
`;

const StyledEmailField = styled(Field)`
  grid-area: email;
`;

const StyledEmailTextField = styled(TextField)`
  margin: 0;
  margin-left: 2rem;
`;

const StyledDangerButton = styled(DangerButton)`
  border-radius: 0;
`;

const StyledRemoveAuthorContainer = styled.div`
  grid-area: remove-author;
  display: flex;
  justify-content: flex-end;
  margin-top: -2rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: contents;
  }
`;

const StyledTypography = styled(Typography)`
  padding: 0.5rem;
`;

const StyledArrowSection = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: none;
  }
`;

const StyledArrowButton = styled(Button)`
  min-width: auto;
`;

interface AuthorCardProps {
  author: Contributor;
  onMoveAuthor: (newSequence: number, oldSequence: number) => void;
  onRemoveAuthorClick: () => void;
  openContributorModal: (unverifiedAuthor: UnverifiedContributor) => void;
  contributorsLength: number;
}

const AuthorCard = ({
  author,
  onMoveAuthor,
  onRemoveAuthorClick,
  openContributorModal,
  contributorsLength,
}: AuthorCardProps) => {
  const { t } = useTranslation('registration');
  const {
    values: {
      entityDescription: { contributors },
    },
  } = useFormikContext<Registration>();

  const fieldArrayIndex = contributors.findIndex(
    (contributor) =>
      contributor.identity.id === author.identity.id &&
      contributor.identity.name === author.identity.name &&
      contributor.role === author.role
  );
  const baseFieldName = `${ContributorFieldNames.CONTRIBUTORS}[${fieldArrayIndex}]`;
  const { values, setFieldValue } = useFormikContext<Registration>();
  const [emailValue, setEmailValue] = useState(values.entityDescription.contributors[fieldArrayIndex]?.email ?? '');
  const [sequenceValue, setSequenceValue] = useState(author.sequence);

  useEffect(() => {
    // Ensure sequence field is updated
    setSequenceValue(author.sequence);
  }, [author.sequence]);

  return (
    <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.megaLight}>
      <StyledAuthorSection key={author.identity.id}>
        <StyledNameField variant="h5">{author.identity.name}</StyledNameField>
        <StyledVerifiedSection>
          {author.identity.id ? (
            <>
              <Tooltip title={t<string>('contributors.known_author_identity')}>
                <StyledCheckIcon />
              </Tooltip>
              <StyledTypography variant="body2">{t('contributors.verified')}</StyledTypography>
            </>
          ) : (
            <Button
              color="primary"
              startIcon={
                <Tooltip title={t<string>('contributors.unknown_author_identity')}>
                  <WarningIcon />
                </Tooltip>
              }
              variant="outlined"
              data-testid={`button-set-unverified-contributor-${author.identity.name}`}
              onClick={() => openContributorModal({ name: author.identity.name, index: fieldArrayIndex })}>
              {t('contributors.verify_person')}
            </Button>
          )}
        </StyledVerifiedSection>
        <StyledRightAlignedWrapper>
          <StyledArrowSection>
            {author.sequence < contributorsLength && (
              <StyledArrowButton color="secondary" onClick={() => onMoveAuthor(author.sequence + 1, author.sequence)}>
                <ArrowDownwardIcon />
              </StyledArrowButton>
            )}
            {author.sequence !== 1 && (
              <StyledArrowButton color="secondary" onClick={() => onMoveAuthor(author.sequence - 1, author.sequence)}>
                <ArrowUpwardIcon />
              </StyledArrowButton>
            )}
          </StyledArrowSection>
          <StyledSequenceTextField
            value={sequenceValue}
            onChange={(event) => setSequenceValue(+event.target.value)}
            variant="filled"
            label={t('common:number_short')}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onMoveAuthor(sequenceValue, author.sequence);
              }
            }}
            onBlur={() => onMoveAuthor(sequenceValue, author.sequence)}
          />
        </StyledRightAlignedWrapper>
        <StyledCorrespondingWrapper>
          <StyledCorrespondingField name={`${baseFieldName}.${SpecificContributorFieldNames.CORRESPONDING}`}>
            {({ field }: FieldProps) => (
              <FormControlLabel
                data-testid="author-corresponding-checkbox"
                control={<Checkbox checked={!!field.value} color="default" {...field} />}
                label={t('contributors.corresponding')}
              />
            )}
          </StyledCorrespondingField>
          {author.correspondingAuthor && (
            <StyledEmailField name={`${baseFieldName}.${SpecificContributorFieldNames.EMAIL}`}>
              {({ field, meta: { error, touched } }: FieldProps) => (
                <StyledEmailTextField
                  data-testid="author-email-input"
                  {...field}
                  label={t('common:email')}
                  required
                  variant="filled"
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
        </StyledCorrespondingWrapper>
      </StyledAuthorSection>
      {author.identity && (
        <AffiliationsCell
          affiliations={author.affiliations}
          authorName={author.identity.name}
          baseFieldName={baseFieldName}
        />
      )}
      <StyledRemoveAuthorContainer>
        <StyledDangerButton
          data-testid={`button-remove-contributor-${author.identity.name}`}
          startIcon={<DeleteIcon />}
          onClick={onRemoveAuthorClick}
          variant="contained">
          {t('contributors.remove_author')}
        </StyledDangerButton>
      </StyledRemoveAuthorContainer>
    </StyledBackgroundDiv>
  );
};

export default AuthorCard;
