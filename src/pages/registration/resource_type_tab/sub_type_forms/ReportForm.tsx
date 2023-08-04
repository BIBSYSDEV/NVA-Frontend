import { PublisherField } from '../components/PublisherField';
import { SeriesFields } from '../components/SeriesFields';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';

export const ReportForm = () => (
  <>
    <PublisherField />

    <IsbnAndPages />

    <SeriesFields />
  </>
);
