import { TextField, Typography, Tooltip, FormControlLabel, Checkbox, Button } from '@material-ui/core';
import { useFormikContext, FieldProps, Field } from 'formik';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Contributor, UnverifiedContributor } from '../../../../types/contributor.types';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import AffiliationsCell from './AffiliationsCell';
import WarningIcon from '@material-ui/icons/Warning';
import CheckIcon from '@material-ui/icons/CheckCircleSharp';
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
  grid-template-areas: 'name verified sequence' 'corresponding . .';
  grid-template-columns: auto auto 1fr;
  grid-column-gap: 1rem;
  align-items: start;
`;

const StyledSequenceField = styled(Field)`
  grid-area: sequence;
`;

const StyledSequenceTextField = styled(TextField)`
  width: 2rem;
  margin: 0;
  margin-right: 1rem;
`;

const StyledNameField = styled(Typography)`
  grid-area: name;
`;

const StyledVerifiedSection = styled.div`
  grid-area: verified;
  display: flex;
  align-items: center;
`;

const StyledVerifiedButton = styled(Button)`
  text-decoration: underline;
  &:hover {
    text-decoration: underline;
  }
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

const StyledInstitutionSection = styled.div`
  grid-area: institution;
`;

const StyledRemoveButton = styled(Button)`
  grid-area: remove-author;
`;

const StyledTypography = styled(Typography)`
  padding: 0.5rem;
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
        <StyledNameField variant="h5">{author.identity.name}</StyledNameField>
        <StyledVerifiedSection>
          {author.identity.arpId ? (
            <>
              <Tooltip title={t('contributors.known_author_identity') as string}>
                <StyledCheckIcon />
              </Tooltip>
              <StyledTypography variant="body2">{t('contributors.verified_author')}</StyledTypography>
            </>
          ) : (
            <>
              <Tooltip title={t('contributors.unknown_author_identity') as string}>
                <StyledWarningIcon />
              </Tooltip>
              <StyledVerifiedButton
                color="primary"
                data-testid={`button-set-unverified-contributor-${author.identity.name}`}
                onClick={() => openContributorModal({ name: author.identity.name, index })}>
                {t('contributors.verify_author')}
              </StyledVerifiedButton>
            </>
          )}
        </StyledVerifiedSection>
        <StyledRightAlignedWrapper>
          <StyledSequenceField name={`${baseFieldName}.${SpecificContributorFieldNames.SEQUENCE}`}>
            {({ field }: FieldProps) => (
              <StyledSequenceTextField
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
        </StyledCorrespondingWrapper>
      </StyledAuthorSection>
      <StyledInstitutionSection>
        {author.identity && <AffiliationsCell affiliations={author.affiliations} baseFieldName={baseFieldName} />}
      </StyledInstitutionSection>
      <StyledRemoveButton
        color="primary"
        variant="contained"
        data-testid={`button-remove-contributor-${author.identity.name}`}
        onClick={onRemoveAuthorClick}>
        {t('contributors.remove_contributor').toUpperCase()}
      </StyledRemoveButton>
    </StyledAuthorCard>
  );
};

export default AuthorCard;
