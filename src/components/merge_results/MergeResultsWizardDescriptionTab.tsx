import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { CompareLanguage } from './fields/CompareLanguage';
import { CompareProjects } from './fields/CompareProjects';
import { CompareMultilineTextField } from './fields/CompareTextField';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { ComapreFundings } from './fields/CompareFundings';

export const MergeResultsWizardDescriptionTab = () => {
  const { t } = useTranslation();
  const { formState } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);

  return (
    <>
      <CompareMultilineTextField
        label={t('common.title')}
        sourceValue={sourceResult.entityDescription?.mainTitle}
        originalTargetValue={formState.defaultValues?.entityDescription?.mainTitle}
        fieldName="entityDescription.mainTitle"
        dataTestId={dataTestId.registrationWizard.description.titleField}
      />

      <CompareMultilineTextField
        label={t('registration.description.abstract')}
        sourceValue={sourceResult.entityDescription?.abstract}
        originalTargetValue={formState.defaultValues?.entityDescription?.abstract}
        fieldName="entityDescription.abstract"
        dataTestId={dataTestId.registrationWizard.description.abstractField}
      />

      <CompareMultilineTextField
        label={t('common.description')}
        sourceValue={sourceResult.entityDescription?.description}
        originalTargetValue={formState.defaultValues?.entityDescription?.description}
        fieldName="entityDescription.description"
        dataTestId={dataTestId.registrationWizard.description.descriptionField}
      />

      <CompareLanguage />

      <CompareProjects />

      <ComapreFundings />
    </>
  );
};
