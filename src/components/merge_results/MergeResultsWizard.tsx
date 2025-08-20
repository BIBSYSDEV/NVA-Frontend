import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Registration } from '../../types/registration.types';
import { MergeResultsWizardActions } from './MergeResultsWizardActions';
import { MergeResultsWizardContent } from './MergeResultsWizardContent';
import { MergeResultsWizardContextProvider } from './MergeResultsWizardContext';
import { MergeResultsWizardHeader } from './MergeResultsWizardHeader';
import { MergeResultsWizardStepper } from './MergeResultsWizardStepper';

interface MergeResultsWizardProps {
  sourceResult: Registration;
  targetResult: Registration;
  onSave: SubmitHandler<Registration>;
}

export const MergeResultsWizard = ({ sourceResult, targetResult, onSave }: MergeResultsWizardProps) => {
  const formMethods = useForm({ defaultValues: targetResult });

  return (
    <FormProvider {...formMethods}>
      <MergeResultsWizardContextProvider value={{ sourceResult }}>
        <form onSubmit={formMethods.handleSubmit(onSave)}>
          <MergeResultsWizardHeader />
          <MergeResultsWizardStepper />
          <MergeResultsWizardContent />
          <MergeResultsWizardActions />
        </form>
      </MergeResultsWizardContextProvider>
    </FormProvider>
  );
};
