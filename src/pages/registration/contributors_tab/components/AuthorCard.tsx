import { Field, FieldProps, useFormikContext } from 'formik';
import React from 'react';
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

const StyledSequenceField = styled(Field)`
  grid-area: sequence;
`;

const StyledSequenceTextField = styled(TextField)`
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
  onArrowMove: (direction: 'up' | 'down') => void;
  onMoveAuthor: (event: React.ChangeEvent<any>) => void;
  onRemoveAuthorClick: () => void;
  openContributorModal: (unverifiedAuthor: UnverifiedContributor) => void;
}

const AuthorCard = ({
  author,
  onArrowMove,
  onMoveAuthor,
  onRemoveAuthorClick,
  openContributorModal,
}: AuthorCardProps) => {
  const { t } = useTranslation('registration');
  const index = author.sequence - 1;
  const baseFieldName = `${ContributorFieldNames.CONTRIBUTORS}[${index}]`;
  const { values, setFieldValue } = useFormikContext<Registration>();
  const contributorsLength = values.entityDescription.contributors.length - 1;

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
              onClick={() => openContributorModal({ name: author.identity.name, index })}>
              {t('contributors.verify_person')}
            </Button>
          )}
        </StyledVerifiedSection>
        <StyledRightAlignedWrapper>
          <StyledArrowSection>
            {index < contributorsLength && (
              <StyledArrowButton color="secondary" onClick={() => onArrowMove('down')}>
                <ArrowDownwardIcon />
              </StyledArrowButton>
            )}
            {index !== 0 && (
              <StyledArrowButton color="secondary" onClick={() => onArrowMove('up')}>
                <ArrowUpwardIcon />
              </StyledArrowButton>
            )}
          </StyledArrowSection>
          <StyledSequenceField name={`${baseFieldName}.${SpecificContributorFieldNames.SEQUENCE}`}>
            {({ field }: FieldProps) => (
              <StyledSequenceTextField
                {...field}
                variant="filled"
                label={t('common:number_short')}
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
          </StyledSequenceField>
        </StyledRightAlignedWrapper>
        <StyledCorrespondingWrapper>
          <Field name={`${baseFieldName}.${SpecificContributorFieldNames.CORRESPONDING}`}>
            {({ field }: FieldProps) => (
              <FormControlLabel
                data-testid="author-corresponding-checkbox"
                control={<Checkbox checked={!!field.value} color="default" {...field} />}
                label={t('contributors.corresponding')}
              />
            )}
          </Field>
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
