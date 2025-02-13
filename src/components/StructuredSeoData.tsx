import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Registration, RegistrationDate } from '../types/registration.types';
import { useJournalSeoData } from '../utils/hooks/useJournalSeoData';

const getPublicationDateCitationString = (publicationDate: RegistrationDate) => {
  if (publicationDate.year && publicationDate.month && publicationDate.day) {
    return `${publicationDate.year}/${publicationDate.month}/${publicationDate.day}`;
  }
  if (publicationDate.year) {
    return publicationDate.year;
  }
  return null;
};

const getDoiCitationString = (registration: Registration) => {
  const doi = registration.doi ?? registration.entityDescription?.reference?.doi ?? '';
  if (!doi) {
    return '';
  }
  const match = doi.match(/10\.\d+\/.*/);
  return match ? match[0] : '';
};

interface StructuredSeoDataProps {
  registration: Registration;
}

export const StructuredSeoData = ({ registration }: StructuredSeoDataProps) => {
  const [seoData, setSeoData] = useState('');

  const journalSeoData = useJournalSeoData(registration);

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        const fetchedSeoData = await fetch(registration.id, {
          headers: { Accept: 'application/vnd.schemaorg.ld+json' },
        });
        const structuredDataText = await fetchedSeoData.text();
        setSeoData(structuredDataText);
      } catch {
        // Ignore errors
      }
    };

    if (registration.id) {
      fetchSeoData();
    }
  }, [registration.id]);

  const citationPublicationDate =
    registration.entityDescription?.publicationDate &&
    getPublicationDateCitationString(registration.entityDescription.publicationDate);

  const citationDoi = getDoiCitationString(registration);

  return (
    <Helmet>
      {seoData && <script type="application/ld+json">{seoData}</script>}

      {registration.entityDescription?.mainTitle && (
        <meta name="citation_title" content={registration.entityDescription.mainTitle} />
      )}
      {registration.entityDescription?.contributors?.map((contributor, index) => (
        <meta name="citation_author" content={contributor.identity.name} key={index} />
      ))}
      {citationPublicationDate && <meta name="citation_publication_date" content={citationPublicationDate} />}
      {citationDoi && <meta name="citation_doi" content={citationDoi} />}

      {journalSeoData.journalName && <meta name="citation_journal_title" content={journalSeoData.journalName} />}
      {journalSeoData.printIssn && <meta name="citation_issn" content={journalSeoData.printIssn} />}
      {journalSeoData.onlineIssn && <meta name="citation_issn" content={journalSeoData.onlineIssn} />}
    </Helmet>
  );
};
