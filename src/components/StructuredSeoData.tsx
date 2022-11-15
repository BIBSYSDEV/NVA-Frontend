import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredSeoDataProps {
  uri: string;
}

export const StructuredSeoData = ({ uri }: StructuredSeoDataProps) => {
  const [seoData, setSeoData] = useState('');

  useEffect(() => {
    const fetchSeoData = async () => {
      const fetchedSeoData = await fetch(uri, {
        headers: { Accept: 'application/vnd.schemaorg.ld+json' },
      });
      const structuredDataText = await fetchedSeoData.text();
      setSeoData(structuredDataText);
    };

    if (uri) {
      fetchSeoData();
    }
  }, [uri]);

  return seoData ? (
    <Helmet>
      <script type="application/ld+json">{seoData}</script>
    </Helmet>
  ) : null;
};
