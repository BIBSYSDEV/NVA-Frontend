import { SubmitHandler, useForm } from 'react-hook-form';
import { Registration } from '../../types/registration.types';
import { MergeResultsWizardActions } from './MergeResultsWizardActions';
import { MergeResultsWizardContent } from './MergeResultsWizardContent';
import { MergeResultsWizardContextProvider } from './MergeResultsWizardContext';
import { MergeResultsWizardHeader } from './MergeResultsWizardHeader';
import { MergeResultsWizardStepper } from './MergeResultsWizardStepper';

interface MergeResultsWizardProps {
  sourceResult: Registration;
  targetResult: Registration;
}

export const MergeResultsWizard = ({ sourceResult, targetResult }: MergeResultsWizardProps) => {
  const formMethods = useForm({ defaultValues: targetResult });

  const onSubmit: SubmitHandler<Registration> = (data) => console.log('SUBMIT', data);

  return (
    <MergeResultsWizardContextProvider value={{ sourceResult, formMethods }}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <MergeResultsWizardHeader />
        <MergeResultsWizardStepper />
        <MergeResultsWizardContent />
        <MergeResultsWizardActions />
      </form>
    </MergeResultsWizardContextProvider>
  );
};
