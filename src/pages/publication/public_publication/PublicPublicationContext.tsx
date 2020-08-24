import React, { FC } from 'react';
import LabelContentRow from '../../../components/LabelContentRow';
import NormalText from '../../../components/NormalText';
import { JournalPublicationContext } from '../../../types/publication_types/journalPublication.types';
import { Link } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { DegreePublicationContext } from '../../../types/publication_types/degreePublication.types';
import { ReportPublicationContext } from '../../../types/publication_types/reportPublication.types';

const StyledContainer = styled.div`
  display: flex;
`;

const StyledOpenInNewIcon = styled(OpenInNewIcon)`
  margin-left: 0.25rem;
`;

export const PublicPublicationContextJournal: FC<{ publicationContext: JournalPublicationContext }> = ({
  publicationContext,
}) => {
  const { t } = useTranslation('publication');

  return (
    <LabelContentRow minimal multiple label={`${t('references.journal')}:`}>
      <StyledContainer>
        <NormalText>{publicationContext.title}</NormalText>
        {publicationContext.url && (
          <Link href={publicationContext.url} target="_blank" rel="noopener noreferrer">
            <StyledOpenInNewIcon aria-label={publicationContext.url} />
          </Link>
        )}
      </StyledContainer>
      {publicationContext.onlineIssn && `${t('references.issn')} ${publicationContext.onlineIssn}`}
    </LabelContentRow>
  );
};

export const PublicPublicationContextDegree: FC<{ publicationContext: DegreePublicationContext }> = ({
  publicationContext,
}) => {
  const { t } = useTranslation('publication');
  const { publisher, seriesTitle, url } = publicationContext;

  return (
    <>
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
      {seriesTitle && (
        <LabelContentRow minimal label={`${t('references.series')}:`}>
          {seriesTitle}
        </LabelContentRow>
      )}
    </>
  );
};

export const PublicPublicationContextReport: FC<{ publicationContext: ReportPublicationContext }> = ({
  publicationContext,
}) => {
  const { t } = useTranslation('publication');

  const { onlineIssn, publisher, seriesTitle, url } = publicationContext;

  return (
    <>
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
      {seriesTitle && (
        <LabelContentRow minimal label={`${t('references.series')}:`}>
          {seriesTitle}
        </LabelContentRow>
      )}
    </>
  );
};
