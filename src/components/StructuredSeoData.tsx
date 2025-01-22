import { useEffect, useState } from 'react';

interface StructuredSeoDataProps {
  uri: string;
}

export const StructuredSeoData = ({ uri }: StructuredSeoDataProps) => {
  const [seoData, setSeoData] = useState('');

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        const fetchedSeoData = await fetch(uri, {
          headers: { Accept: 'application/vnd.schemaorg.ld+json' },
        });
        const structuredDataText = await fetchedSeoData.text();
        setSeoData(structuredDataText);
      } catch {
        // Ignore errors
      }
    };

    if (uri) {
      fetchSeoData();
    }
  }, [uri]);

  useEffect(() => {
    if (seoData) {
      const scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.text = seoData;

      document.head.appendChild(scriptTag);

      return () => {
        document.head.removeChild(scriptTag);
      };
    }
  }, [seoData]);

  return null;
};
