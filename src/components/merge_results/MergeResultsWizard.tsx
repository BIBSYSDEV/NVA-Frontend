import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../types/registration.types';
import { getSourceRegistrationHeading } from '../../utils/translation-helpers';
import { BackgroundDiv } from '../styled/Wrappers';
import { MergeResultsWizardActions, MergeResultsWizardActionsProps } from './MergeResultsWizardActions';
import { MergeResultsWizardContent } from './MergeResultsWizardContent';
import { MergeResultsWizardContextProvider } from './MergeResultsWizardContext';
import { MergeResultsWizardHeader } from './MergeResultsWizardHeader';
import { MergeResultsWizardStepper } from './MergeResultsWizardStepper';

interface MergeResultsWizardProps extends MergeResultsWizardActionsProps {
  sourceResult: Registration;
  targetResult: Registration;
  onSave: SubmitHandler<Registration>;
}

export const MergeResultsWizard = ({ sourceResult, targetResult, onSave, onCancel }: MergeResultsWizardProps) => {
  const { t } = useTranslation();
  const formMethods = useForm({ defaultValues: targetResult });

  return (
    <FormProvider {...formMethods}>
      <MergeResultsWizardContextProvider
        value={{
          sourceResult,
          sourceHeading: getSourceRegistrationHeading(t),
        }}>
        <form onSubmit={formMethods.handleSubmit(onSave)}>
          <MergeResultsWizardHeader />
          <MergeResultsWizardStepper />
          <BackgroundDiv
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 10rem 1fr' },
              gap: '1rem 0.5rem',
              mt: '2rem',
              alignItems: 'center',
            }}>
            <MergeResultsWizardContent />
            <MergeResultsWizardActions onCancel={onCancel} />
          </BackgroundDiv>
        </form>
      </MergeResultsWizardContextProvider>
    </FormProvider>
  );
};
