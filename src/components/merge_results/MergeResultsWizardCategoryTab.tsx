import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { JournalType, PublicationType } from '../../types/publicationFieldNames';
import { JournalRegistration } from '../../types/publication_types/journalRegistration.types';
import { Registration } from '../../types/registration.types';
import { getMainRegistrationType } from '../../utils/registration-helpers';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { CompareJournalFields } from './fields/CompareJournalFields';

export const MergeResultsWizardCategoryTab = () => {
  const { control } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);

  const sourceInstanceType = sourceResult?.entityDescription?.reference?.publicationInstance?.type ?? '';
  const targetInstanceType = useWatch({ name: 'entityDescription.reference.publicationInstance.type', control }) ?? '';

  const sourceMainType = getMainRegistrationType(sourceInstanceType);
  const categoryMainType = getMainRegistrationType(targetInstanceType);

  const hasJournalFields =
    sourceMainType === PublicationType.PublicationInJournal &&
    categoryMainType === PublicationType.PublicationInJournal &&
    sourceInstanceType !== JournalType.Corrigendum &&
    targetInstanceType !== JournalType.Corrigendum;

  return <>{hasJournalFields && <CompareJournalFields sourceResult={sourceResult as JournalRegistration} />}</>;
};
