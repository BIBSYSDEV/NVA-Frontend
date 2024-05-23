import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ImportCandidateSummary } from '../../../../types/importCandidate.types';
import { isJournal } from '../../../../utils/registration-helpers';

interface ImportCandidateChannelNameProps {
  importCandidate: ImportCandidateSummary;
}

export const ImportCandidateChannelName = ({ importCandidate }: ImportCandidateChannelNameProps) => {
  const { t } = useTranslation();

  const shouldHaveJournal = isJournal(importCandidate.publicationInstance?.type);

  if (shouldHaveJournal) {
    const journal = importCandidate.journal?.name ?? importCandidate.journal?.id;
    if (journal) {
      return <Typography fontWeight={600}>{journal}</Typography>;
    } else {
      return <Typography>{t('basic_data.central_import.missing_journal')}</Typography>;
    }
  }

  const publisher = importCandidate.publisher?.name ?? importCandidate.publisher?.id;
  if (publisher) {
    return <Typography fontWeight={600}>{publisher}</Typography>;
  }
  return <Typography>{t('basic_data.central_import.missing_publisher')}</Typography>;
};
