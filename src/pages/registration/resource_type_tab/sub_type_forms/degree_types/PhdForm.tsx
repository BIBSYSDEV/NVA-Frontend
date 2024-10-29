import { PublisherField } from '../../components/PublisherField';
import { SeriesFields } from '../../components/SeriesFields';
import { IsbnAndPages } from '../../components/isbn_and_pages/IsbnAndPages';
import { RelatedResultsField } from '../../components/RelatedResultsField';

export const PhdForm = () => {
  return (
    <>
      <PublisherField />

      <IsbnAndPages />
      <SeriesFields />

      <RelatedResultsField />
    </>
  );
};
