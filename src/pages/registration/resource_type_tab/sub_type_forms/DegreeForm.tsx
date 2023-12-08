import { DegreeType } from '../../../../types/publicationFieldNames';
import { PublisherField } from '../components/PublisherField';
import { SeriesFields } from '../components/SeriesFields';
import { IsbnAndPages } from '../components/isbn_and_pages/IsbnAndPages';
import { TotalPagesField } from '../components/isbn_and_pages/TotalPagesField';

interface DegreeFormProps {
  subType: string;
}

export const DegreeForm = ({ subType }: DegreeFormProps) => (
  <>
    <PublisherField />

    {subType === DegreeType.Bachelor || subType === DegreeType.Master ? <TotalPagesField /> : <IsbnAndPages />}
    {(subType === DegreeType.Phd || subType === DegreeType.Licentiate) && <SeriesFields />}
  </>
);
