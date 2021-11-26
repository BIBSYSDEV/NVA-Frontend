import { DoiField } from '../components/DoiField';
import { SeriesFields } from '../components/SeriesFields';
import { PublisherField } from '../components/PublisherField';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';

export const ReportForm = () => (
  <>
    <DoiField />
    <PublisherField />

    <IsbnAndPages />

    <SeriesFields />
  </>
);
