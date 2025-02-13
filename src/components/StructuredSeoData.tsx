import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Registration, RegistrationDate } from '../types/registration.types';

const getPublicationDateSeoString = (publicationDate: RegistrationDate) => {
  if (publicationDate.year && publicationDate.month && publicationDate.day) {
    return `${publicationDate.year}/${publicationDate.month}/${publicationDate.day}`;
  }
  if (publicationDate.year) {
    return publicationDate.year;
  }
  return null;
};

interface StructuredSeoDataProps {
  registration: Registration;
}

export const StructuredSeoData = ({ registration }: StructuredSeoDataProps) => {
  const [seoData, setSeoData] = useState('');

  const registrationIsPublished = registration && registration.status === 'PUBLISHED';

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

    if (registrationIsPublished) {
      fetchSeoData();
    }
  }, [registration.id, registrationIsPublished]);

  if (!registrationIsPublished) {
    return null;
  }

  const citationPublicationDate =
    registration.entityDescription?.publicationDate &&
    getPublicationDateSeoString(registration.entityDescription.publicationDate);

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
    </Helmet>
  );
};
