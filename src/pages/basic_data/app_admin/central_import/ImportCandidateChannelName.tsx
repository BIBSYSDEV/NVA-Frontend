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
    if (importCandidate.journal?.name) {
      return <Typography fontWeight={600}>{importCandidate.journal.name}</Typography>;
    } else {
      return <Typography>{t('basic_data.central_import.missing_journal')}</Typography>;
    }
  }

  if (importCandidate.publisher?.name) {
    return <Typography fontWeight={600}>{importCandidate.publisher.name}</Typography>;
  }
  return <Typography>{t('basic_data.central_import.missing_publisher')}</Typography>;
};
