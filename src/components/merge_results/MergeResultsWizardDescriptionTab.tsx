import { CompareAbstract } from './fields/CompareAbstract';
import { CompareDescription } from './fields/CompareDescription';
import { CompareLanguage } from './fields/CompareLanguage';
import { CompareMainTitle } from './fields/CompareMainTitle';

export const MergeResultsWizardDescriptionTab = () => {
  return (
    <>
      <CompareMainTitle />
      <CompareAbstract />
      <CompareDescription />
      <CompareLanguage />
    </>
  );
};
