import { Box, Chip, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import {
  ArtisticType,
  BookType,
  ChapterType,
  DegreeType,
  JournalType,
  MediaType,
  OtherRegistrationType,
  PresentationType,
  PublicationType,
  ReportType,
  ResearchDataType,
} from '../../../types/publicationFieldNames';
import { PublicationInstanceType, Registration } from '../../../types/registration.types';

interface SelectRegistrationTypeProps {
  onChangeType: (type: PublicationInstanceType) => void;
}

export const SelectRegistrationType = ({ onChangeType }: SelectRegistrationTypeProps) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<Registration>();
  const selectedType = values.entityDescription?.reference?.publicationInstance.type ?? '';

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'center' }}>
      <TypeRow
        mainType={PublicationType.PublicationInJournal}
        subTypes={Object.values(JournalType)}
        value={selectedType}
        onChangeType={onChangeType}
      />
      <TypeRow
        mainType={PublicationType.Book}
        subTypes={Object.values(BookType)}
        value={selectedType}
        onChangeType={onChangeType}
      />
      <TypeRow
        mainType={PublicationType.Report}
        subTypes={Object.values(ReportType)}
        value={selectedType}
        onChangeType={onChangeType}
      />
      <TypeRow
        mainType={PublicationType.Degree}
        subTypes={Object.values(DegreeType)}
        value={selectedType}
        onChangeType={onChangeType}
      />
      <TypeRow
        mainType={PublicationType.Chapter}
        subTypes={Object.values(ChapterType)}
        value={selectedType}
        onChangeType={onChangeType}
      />
      <TypeRow
        mainType={PublicationType.Presentation}
        subTypes={Object.values(PresentationType)}
        value={selectedType}
        onChangeType={onChangeType}
      />
      <TypeRow
        mainType={PublicationType.Artistic}
        subTypes={Object.values(ArtisticType)}
        value={selectedType}
        onChangeType={onChangeType}
      />
      <TypeRow
        mainType={PublicationType.MediaContribution}
        subTypes={Object.values(MediaType)}
        value={selectedType}
        onChangeType={onChangeType}
      />
      <TypeRow
        mainType={PublicationType.ResearchData}
        subTypes={Object.values(ResearchDataType)}
        value={selectedType}
        onChangeType={onChangeType}
      />
      <TypeRow
        mainType={PublicationType.GeographicalContent}
        subTypes={Object.values(OtherRegistrationType)}
        value={selectedType}
        onChangeType={onChangeType}
      />
    </Box>
  );
};

interface TypeRowProps extends SelectRegistrationTypeProps {
  mainType: PublicationType;
  subTypes: PublicationInstanceType[];
  value: string;
}

export const TypeRow = ({ mainType, subTypes, value, onChangeType }: TypeRowProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Typography>{t(`registration.publication_types.${mainType}`)}</Typography>
      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
        {subTypes.map((subType) => (
          <Chip
            key={subType}
            variant={value === subType ? 'filled' : 'outlined'}
            color="primary"
            onClick={() => onChangeType(subType)}
            label={t(`registration.publication_types.${subType}`)}
          />
        ))}
      </Box>
    </>
  );
};
