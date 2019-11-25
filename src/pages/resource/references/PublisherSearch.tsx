import Axios from 'axios';
import React from 'react';

import { AutoSearch } from '../../../components/AutoSearch';
import { PublicationChannel } from '../../../types/references.types';
import { PUBLISHERS_URL } from '../../../utils/constants';

interface PublisherSearchProps {
  setFieldValue: (value: any) => void;
}

export const PublisherSearch: React.FC<PublisherSearchProps> = ({ setFieldValue }) => {
  const requestUrl = PUBLISHERS_URL;
  const [searchResults, setSearchResults] = React.useState<PublicationChannel[]>([]);

  const getQueryWithSearchTerm = (searchTerm: string) => {
    return {
      tabell_id: 851,
      api_versjon: 1,
      statuslinje: 'N',
      begrensning: '10',
      kodetekst: 'J',
      desimal_separator: '.',
      variabler: ['*'],
      sortBy: [],
      filter: [{ variabel: 'Original tittel', selection: { filter: 'like', values: [`%${searchTerm}%`] } }],
    };
  };

  const search = async (searchTerm: string) => {
    try {
      const response = await Axios({
        method: 'POST',
        url: requestUrl,
        data: getQueryWithSearchTerm(searchTerm),
      });
      setSearchResults(
        response.data.map((item: any) => ({
          title: item['Original tittel'],
          issn: item['Online ISSN'],
          level: item['Nivå 2019'],
          publisher: item['Utgiver'],
        }))
      );
    } catch (e) {
      // dispatch errors here
      console.log(e);
    }
  };

  const handleInputChange = (event: object, value: string) => {
    if (event !== null && value.length > 3) {
      // need debounce function here
      search(value);
    }
  };

  return (
    <AutoSearch
      onInputChange={handleInputChange}
      searchResults={searchResults}
      setFieldValue={setFieldValue}
      formikFieldName="publisher"
      label="Publisher"
    />
  );
};

export default PublisherSearch;
