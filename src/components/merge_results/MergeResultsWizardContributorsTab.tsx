import { Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../types/contributor.types';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { CompareContributors } from './fields/CompareContributors';
import { mergeContributors } from './merge-results-helpers';

enum ContributorMergeOption {
  SourceOnly,
  TargetOnly,
  MergeBoth,
}

export const MergeResultsWizardContributorsTab = () => {
  const { t } = useTranslation();
  const { formState, setValue } = useFormContext<Registration>();
  const { sourceResult, sourceHeading } = useContext(MergeResultsWizardContext);
  const sourceContributors = sourceResult.entityDescription?.contributors ?? [];

  const initialTargetContributors = (formState.defaultValues?.entityDescription?.contributors ?? []) as Contributor[];

  return (
    <>
      <RadioGroup
        sx={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: 'subgrid' }}
        defaultValue={ContributorMergeOption.TargetOnly}>
        <div>
          <FormControlLabel
            data-testid={dataTestId.basicData.centralImport.mergeContributorsRadioButtons.mergeAllContributors}
            value={ContributorMergeOption.MergeBoth}
            control={<Radio />}
            onChange={() => {
              const mergedContributors = mergeContributors(sourceContributors, initialTargetContributors);
              setValue('entityDescription.contributors', mergedContributors);
            }}
            label={t('keep_all_contributors', { sourceType: sourceHeading.toLocaleLowerCase() })}
          />
          <FormControlLabel
            data-testid={dataTestId.basicData.centralImport.mergeContributorsRadioButtons.keepContributorsFromSource}
            value={ContributorMergeOption.SourceOnly}
            control={<Radio />}
            onChange={() => setValue('entityDescription.contributors', sourceContributors)}
            label={t('keep_contributors_from_source_result', { sourceType: sourceHeading.toLocaleLowerCase() })}
          />
        </div>
        <FormControlLabel
          data-testid={dataTestId.basicData.centralImport.mergeContributorsRadioButtons.keepContributorsFromTarget}
          value={ContributorMergeOption.TargetOnly}
          control={<Radio />}
          onChange={() => setValue('entityDescription.contributors', initialTargetContributors)}
          label={t('keep_contributors_from_published_result')}
          sx={{ gridColumn: { xs: 1, md: 3 } }}
        />
      </RadioGroup>

      <Divider sx={{ display: { xs: 'block', md: 'none' } }} />

      <CompareContributors />

      {/* {targetContributors.map((contributor, index) => ( */}
      {/*   <CompareContributor */}
      {/*     key={contributor.identity.id || `${contributor.identity.name}${index}`} */}
      {/*     targetContributor={contributor} */}
      {/*   /> */}
      {/* ))} */}
      {/**/}
      {/* {sourceContributors.map((contributor, index) => ( */}
      {/*   <CompareContributor */}
      {/*     key={contributor.identity.id || `${contributor.identity.name}${index}`} */}
      {/*     sourceContributor={contributor} */}
      {/*   /> */}
      {/* ))} */}
    </>
  );
};
