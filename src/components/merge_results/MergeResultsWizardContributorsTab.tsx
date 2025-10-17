import { Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../types/contributor.types';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { isOnImportPage } from '../../utils/urlPaths';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { CompareContributor } from './fields/CompareContributor';

enum ContributorMergeOption {
  SourceOnly,
  TargetOnly,
}

export const MergeResultsWizardContributorsTab = () => {
  const { t } = useTranslation();
  const { control, formState, setValue } = useFormContext<Registration>();
  const { sourceResult } = useContext(MergeResultsWizardContext);
  const sourceContributors = sourceResult.entityDescription?.contributors ?? [];

  const targetContributors = useWatch({ name: 'entityDescription.contributors', control }) ?? [];
  const initialTargetContributors = (formState.defaultValues?.entityDescription?.contributors ?? []) as Contributor[];

  return (
    <>
      <RadioGroup
        sx={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: 'subgrid' }}
        defaultValue={ContributorMergeOption.TargetOnly}>
        <FormControlLabel
          data-testid={dataTestId.basicData.centralImport.keepContributorsFromSourceRadio}
          value={ContributorMergeOption.SourceOnly}
          control={<Radio />}
          onChange={() => setValue('entityDescription.contributors', sourceContributors)}
          label={t('keep_contributors_from_source_result', {
            sourceType: isOnImportPage()
              ? t('basic_data.central_import.import_candidate').toLocaleLowerCase()
              : t('unpublished_result').toLocaleLowerCase(),
          })}
        />
        <FormControlLabel
          data-testid={dataTestId.basicData.centralImport.keepContributorsFromTargetRadio}
          value={ContributorMergeOption.TargetOnly}
          control={<Radio />}
          onChange={() => setValue('entityDescription.contributors', initialTargetContributors)}
          label={t('keep_contributors_from_published_result')}
          sx={{ gridColumn: { xs: 1, md: 3 } }}
        />
      </RadioGroup>

      <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

      {targetContributors.map((contributor, index) => (
        <CompareContributor
          key={contributor.identity.id || `${contributor.identity.name}${index}`}
          targetContributor={contributor}
        />
      ))}

      {sourceContributors.map((contributor, index) => (
        <CompareContributor
          key={contributor.identity.id || `${contributor.identity.name}${index}`}
          sourceContributor={contributor}
        />
      ))}
    </>
  );
};
