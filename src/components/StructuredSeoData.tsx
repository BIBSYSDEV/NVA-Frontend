import { Helmet } from '@dr.pogodin/react-helmet';
import { useEffect, useState } from 'react';
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

const doiRegex = /10\.\d+\/.*/;
const getDoiCitationString = (registration: Registration) => {
  const doiUrl = registration.doi ?? registration.entityDescription?.reference?.doi ?? '';
  if (!doiUrl) {
    return '';
  }
  const match = doiUrl.match(doiRegex);
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
      {seoData ? <script type="application/ld+json">{seoData}</script> : null}

      {registration.entityDescription?.mainTitle ? (
        <meta name="citation_title" content={registration.entityDescription.mainTitle} />
      ) : null}
      {registration.entityDescription?.contributors?.map((contributor, index) => (
        <meta name="citation_author" content={contributor.identity.name} key={index} />
      ))}
      {citationPublicationDate ? <meta name="citation_publication_date" content={citationPublicationDate} /> : null}
      {citationDoi ? <meta name="citation_doi" content={citationDoi} /> : null}

      {journalSeoData.journalName ? <meta name="citation_journal_title" content={journalSeoData.journalName} /> : null}
      {journalSeoData.printIssn ? <meta name="citation_issn" content={journalSeoData.printIssn} /> : null}
      {journalSeoData.onlineIssn ? <meta name="citation_issn" content={journalSeoData.onlineIssn} /> : null}
    </Helmet>
  );
};
