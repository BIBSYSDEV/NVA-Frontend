import { useQuery } from '@tanstack/react-query';
import { fetchResource } from '../../api/commonApi';
import { JournalRegistration } from '../../types/publication_types/journalRegistration.types';
import { Registration, SerialPublication } from '../../types/registration.types';
import { isJournal } from '../registration-helpers';

export const useJournalSeoData = (registration: Registration) => {
  const isJournalRegistration = isJournal(registration.entityDescription?.reference?.publicationInstance?.type);
  const journalId = isJournalRegistration
    ? ((registration as JournalRegistration).entityDescription?.reference?.publicationContext.id ?? '')
    : '';

  const journalQuery = useQuery({
    queryKey: ['channel', journalId],
    enabled: !!journalId,
    queryFn: () => fetchResource<SerialPublication>(journalId),
    staleTime: Infinity,
  });

  const journalName = journalQuery.data?.name ?? '';
  const onlineIssn = journalQuery.data?.onlineIssn ?? '';
  const printIssn = journalQuery.data?.printIssn ?? '';

  return { journalName, onlineIssn, printIssn };
};
