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
import { getRemoveContributorText } from '../../../../utils/validation/registration/contributorTranslations';
import AffiliationsCell from './AffiliationsCell';

const StyledCheckIcon = styled(CheckIcon)`
  color: ${({ theme }) => theme.palette.success.main};
`;

const StyledBackgroundDiv = styled(BackgroundDiv)`
  display: grid;
  grid-template-areas: 'contributor contributor' 'affiliation affiliation' 'add-affiliation remove-contributor';
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'contributor' 'affiliation' 'add-affiliation' 'remove-contributor';
  }
  margin-top: 1rem;
`;

const StyledContributorSection = styled.div`
  grid-area: contributor;
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
`;

const StyledDangerButton = styled(DangerButton)`
  border-radius: 0;
`;

const StyledRemoveContributorContainer = styled.div`
  grid-area: remove-contributor;
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

interface ContributorCardProps {
  contributor: Contributor;
  onMoveContributor: (newSequence: number, oldSequence: number) => void;
  onRemoveContributorClick: () => void;
  openContributorModal: (unverifiedContributor: UnverifiedContributor) => void;
}

export const ContributorCard = ({
  contributor,
  onMoveContributor,
  onRemoveContributorClick,
  openContributorModal,
}: ContributorCardProps) => {
  const { t } = useTranslation('registration');
  const {
    values: {
      entityDescription: { contributors },
    },
  } = useFormikContext<Registration>();

  const contributorIndex = contributors.findIndex(
    (c) =>
      c.identity.id === contributor.identity.id &&
      c.identity.name === contributor.identity.name &&
      c.role === contributor.role
  );
  const baseFieldName = `${ContributorFieldNames.CONTRIBUTORS}[${contributorIndex}]`;
  const { setFieldValue } = useFormikContext<Registration>();
  const [sequenceValue, setSequenceValue] = useState(`${contributor.sequence}`);
  const numberOfContributorsWithSameRole = contributors.filter((c) => c.role === contributor.role).length;

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
    <StyledBackgroundDiv backgroundColor={lightTheme.palette.section.megaLight}>
      <StyledContributorSection>
        <StyledNameField variant="h5" variantMapping={{ h5: 'h3' }}>
          {contributor.identity.name}
        </StyledNameField>
        <StyledVerifiedSection>
          {contributor.identity.id ? (
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
              data-testid={`button-set-unverified-contributor-${contributor.identity.name}`}
              onClick={() => openContributorModal({ name: contributor.identity.name, index: contributorIndex })}>
              {t('contributors.verify_person')}
            </Button>
          )}
        </StyledVerifiedSection>
        <StyledRightAlignedWrapper>
          <StyledArrowSection>
            {contributor.sequence < numberOfContributorsWithSameRole && (
              <Tooltip title={t<string>('contributors.move_down')}>
                <StyledArrowButton
                  color="secondary"
                  onClick={() => onMoveContributor(contributor.sequence + 1, contributor.sequence)}>
                  <ArrowDownwardIcon />
                </StyledArrowButton>
              </Tooltip>
            )}
            {contributor.sequence !== 1 && (
              <Tooltip title={t<string>('contributors.move_up')}>
                <StyledArrowButton
                  color="secondary"
                  onClick={() => onMoveContributor(contributor.sequence - 1, contributor.sequence)}>
                  <ArrowUpwardIcon />
                </StyledArrowButton>
              </Tooltip>
            )}
          </StyledArrowSection>
          <StyledSequenceTextField
            id={`sequence-${contributor.sequence}`}
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
        </StyledRightAlignedWrapper>
        <StyledCorrespondingWrapper>
          <Field name={`${baseFieldName}.${SpecificContributorFieldNames.CORRESPONDING}`}>
            {({ field }: FieldProps) => (
              <FormControlLabel
                data-testid="author-corresponding-checkbox"
                control={
                  <Checkbox
                    checked={!!field.value}
                    color="default"
                    {...field}
                    // TODO: Remove this block when backend has removed validation for email field
                    onChange={(event) => {
                      field.onChange(event);
                      if (event.target.checked) {
                        setFieldValue(`${baseFieldName}.${SpecificContributorFieldNames.EMAIL}`, 'NO_EMAIL');
                      }
                    }}
                  />
                }
                label={t('contributors.corresponding')}
              />
            )}
          </Field>
        </StyledCorrespondingWrapper>
      </StyledContributorSection>
      {contributor.identity && (
        <AffiliationsCell
          affiliations={contributor.affiliations}
          authorName={contributor.identity.name}
          baseFieldName={baseFieldName}
        />
      )}
      <StyledRemoveContributorContainer>
        <StyledDangerButton
          data-testid={`button-remove-contributor-${contributor.identity.name}`}
          startIcon={<DeleteIcon />}
          onClick={onRemoveContributorClick}
          variant="contained">
          {getRemoveContributorText(contributor.role)}
        </StyledDangerButton>
      </StyledRemoveContributorContainer>
    </StyledBackgroundDiv>
  );
};
