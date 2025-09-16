import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { JournalType, PublicationType } from '../../types/publicationFieldNames';
import { JournalRegistration } from '../../types/publication_types/journalRegistration.types';
import { Registration } from '../../types/registration.types';
import { getMainRegistrationType } from '../../utils/registration-helpers';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { CompareCategory } from './fields/CompareCategory';
import { CompareJournalFields } from './fields/CompareJournalFields';

export const MergeResultsWizardCategoryTab = () => {
  const { control } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);

  const sourceInstanceType = sourceResult.entityDescription?.reference?.publicationInstance?.type ?? '';
  const sourceMainType = getMainRegistrationType(sourceInstanceType);

  const targetInstanceType = useWatch({ name: 'entityDescription.reference.publicationInstance.type', control }) ?? '';
  const targetMainType = getMainRegistrationType(targetInstanceType);

  const hasJournalFields =
    sourceMainType === PublicationType.PublicationInJournal &&
    targetMainType === PublicationType.PublicationInJournal &&
    sourceInstanceType !== JournalType.Corrigendum &&
    targetInstanceType !== JournalType.Corrigendum;

  return (
    <>
      <CompareCategory
        sourceInstanceType={sourceInstanceType}
        targetInstanceType={targetInstanceType}
        sourceMainType={sourceMainType}
        targetMainType={targetMainType}
      />

      {hasJournalFields && <CompareJournalFields sourceResult={sourceResult as JournalRegistration} />}
    </>
  );
};
