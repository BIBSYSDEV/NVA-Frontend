import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { LanguageCodes, registrationLanguages } from '../../types/language.types';
import { BookPublicationContext } from '../../types/publication_types/bookRegistration.types';
import { ChapterPublicationContext } from '../../types/publication_types/chapterRegistration.types';
import { DegreePublicationContext } from '../../types/publication_types/degreeRegistration.types';
import {
  JournalPublicationContext,
  JournalPublicationInstance,
} from '../../types/publication_types/journalRegistration.types';
import { ReportPublicationContext } from '../../types/publication_types/reportRegistration.types';
import { JournalType } from '../../types/publicationFieldNames';
import { getNpiDiscipline } from '../../utils/npiDisciplines';
import { isBook, isChapter, isDegree, isJournal, isReport } from '../../utils/registration-helpers';
import PublicDoi from './PublicDoi';
import {
  PublicJournalContent,
  PublicLinkedContextContent,
  PublicPublisherContent,
  PublicSeriesContent,
} from './PublicPublicationContext';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import RegistrationSummary from './RegistrationSummary';

const StyledContent = styled.div`
  display: grid;
  grid-template-areas: 'group0 group1';
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1rem;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.values.sm}px`}) {
    grid-template-areas: 'group0' 'group1';
    grid-template-columns: 1fr;
    grid-row-gap: 1rem;
  }
`;

const StyledGroup0 = styled.div`
  grid-area: group0;
`;

const StyledGroup1 = styled.div`
  grid-area: group1;
`;

const StyledPublicDoi = styled.div`
  margin-top: 1.5rem;
`;

const PublicGeneralContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation('registration');
  const {
    date,
    npiSubjectHeading,
    language,
    reference: { publicationContext, publicationInstance },
  } = registration.entityDescription;

  return (
    <StyledContent>
      <StyledGroup0>
        <Typography variant="subtitle2">{t('public_page.about_registration')}</Typography>

        {(publicationInstance as JournalPublicationInstance).peerReviewed && (
          <Typography>{t('resource_type.peer_reviewed')}</Typography>
        )}

        {language && (
          <Typography>
            {t('common:language')}:{' '}
            {t(
              `languages:${
                registrationLanguages.find((registrationLanguage) => registrationLanguage.value === language)?.id ??
                LanguageCodes.Undefined
              }`
            )}
          </Typography>
        )}

        <StyledPublicDoi>
          <PublicDoi registration={registration} />
        </StyledPublicDoi>
        {npiSubjectHeading && (
          <Typography>
            {t('description.npi_disciplines')}: {getNpiDiscipline(npiSubjectHeading)?.name}
          </Typography>
        )}
      </StyledGroup0>

      <StyledGroup1>
        {/* {isJournal(registration) ? (
          <PublicPublicationInstanceJournal publicationInstance={publicationInstance as JournalPublicationInstance} />
        ) : isBook(registration) ? (
          <>
            <PublicPublicationInstanceBook publicationInstance={publicationInstance as BookPublicationInstance} />
            <PublicIsbnContent
              isbnList={(registration as BookRegistration).entityDescription.reference.publicationContext.isbnList}
            />
          </>
        ) : isDegree(registration) ? (
          <PublicPublicationInstanceDegree publicationInstance={publicationInstance as DegreePublicationInstance} />
        ) : isReport(registration) ? (
          <>
            <PublicPublicationInstanceReport publicationInstance={publicationInstance as ReportPublicationInstance} />
            <PublicIsbnContent
              isbnList={(registration as ReportRegistration).entityDescription.reference.publicationContext.isbnList}
            />
          </>
        ) : isChapter(registration) ? (
          <PublicPublicationInstanceChapter publicationInstance={publicationInstance as ChapterPublicationInstance} />
        ) : null} */}
        {isJournal(registration) ? (
          <>
            {publicationInstance.type === JournalType.CORRIGENDUM && (
              <>
                <Typography variant="h3">{t('resource_type.original_article')}</Typography>
                <RegistrationSummary id={(publicationInstance as JournalPublicationInstance).corrigendumFor} />
              </>
            )}
            <PublicJournalContent date={date} publicationContext={publicationContext as JournalPublicationContext} />
          </>
        ) : isBook(registration) ? (
          <>
            <PublicPublisherContent publicationContext={publicationContext as BookPublicationContext} />
            <PublicSeriesContent seriesTitle={(publicationContext as BookPublicationContext).seriesTitle} />
          </>
        ) : isDegree(registration) ? (
          <>
            <PublicPublisherContent publicationContext={publicationContext as DegreePublicationContext} />
            <PublicSeriesContent seriesTitle={(publicationContext as DegreePublicationContext).seriesTitle} />
          </>
        ) : isReport(registration) ? (
          <>
            <PublicPublisherContent publicationContext={publicationContext as ReportPublicationContext} />
            <PublicSeriesContent seriesTitle={(publicationContext as ReportPublicationContext).seriesTitle} />
          </>
        ) : isChapter(registration) ? (
          <PublicLinkedContextContent publicationContext={publicationContext as ChapterPublicationContext} />
        ) : null}
      </StyledGroup1>
    </StyledContent>
  );
};

export default PublicGeneralContent;
