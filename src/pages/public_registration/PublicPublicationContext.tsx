import React, { FC } from 'react';
import LabelContentRow from '../../components/LabelContentRow';
import NormalText from '../../components/NormalText';
import { JournalPublicationContext } from '../../types/publication_types/journalRegistration.types';
import { Link } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { DegreePublicationContext } from '../../types/publication_types/degreeRegistration.types';
import { ReportPublicationContext } from '../../types/publication_types/reportRegistration.types';

const StyledContainer = styled.div`
  display: flex;
`;

const StyledOpenInNewIcon = styled(OpenInNewIcon)`
  margin-left: 0.25rem;
`;

export const PublicPublicationContextJournal: FC<{ publicationContext: JournalPublicationContext }> = ({
  publicationContext,
}) => {
  const { t } = useTranslation('registration');
  const { onlineIssn, title, url } = publicationContext;

  return title ? (
    <LabelContentRow minimal multiple label={`${t('references.journal')}:`}>
      <StyledContainer>
        <NormalText>{title}</NormalText>
        {url && (
          <Link href={url} target="_blank" rel="noopener noreferrer">
            <StyledOpenInNewIcon aria-label={url} />
          </Link>
        )}
      </StyledContainer>
      {onlineIssn && `${t('references.issn')} ${onlineIssn}`}
    </LabelContentRow>
  ) : null;
};

export const PublicPublicationContextDegree: FC<{ publicationContext: DegreePublicationContext }> = ({
  publicationContext,
}) => {
  const { t } = useTranslation('registration');
  const { publisher, seriesTitle, url } = publicationContext;

  return (
    <>
      {publisher && (
        <LabelContentRow minimal multiple label={`${t('common:publisher')}:`}>
          <StyledContainer>
            <NormalText>{publisher}</NormalText>
            {url && (
              <Link href={url} target="_blank" rel="noopener noreferrer">
                <StyledOpenInNewIcon aria-label={url} />
              </Link>
            )}
          </StyledContainer>
        </LabelContentRow>
      )}
      <DisplaySeriesTitle seriesTitle={seriesTitle} />
    </>
  );
};

export const PublicPublicationContextReport: FC<{ publicationContext: ReportPublicationContext }> = ({
  publicationContext,
}) => {
  const { t } = useTranslation('registration');
  const { onlineIssn, publisher, seriesTitle, url } = publicationContext;

  return (
    <>
      {publisher && (
        <LabelContentRow minimal multiple label={`${t('common:publisher')}:`}>
          <StyledContainer>
            <NormalText>{publisher}</NormalText>
            {url && (
              <Link href={url} target="_blank" rel="noopener noreferrer">
                <StyledOpenInNewIcon aria-label={url} />
              </Link>
            )}
          </StyledContainer>
          {onlineIssn && `${t('references.issn')} ${onlineIssn}`}
        </LabelContentRow>
      )}
      <DisplaySeriesTitle seriesTitle={seriesTitle} />
    </>
  );
};

const DisplaySeriesTitle: FC<{ seriesTitle: string }> = ({ seriesTitle }) => {
  const { t } = useTranslation('registration');

  return seriesTitle ? (
    <LabelContentRow minimal label={`${t('references.series')}:`}>
      {seriesTitle}
    </LabelContentRow>
  ) : null;
};
