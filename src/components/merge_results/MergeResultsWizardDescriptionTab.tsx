import { CompareAbstract } from './fields/CompareAbstract';
import { CompareDescription } from './fields/CompareDescription';
import { CompareMainTitle } from './fields/CompareMainTitle';

export const MergeResultsWizardDescriptionTab = () => {
  return (
    <>
      <CompareMainTitle />
      <CompareAbstract />
      <CompareDescription />
    </>
  );
};
