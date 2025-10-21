import { Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Contributor } from '../../types/contributor.types';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';
import { CompareContributor } from './fields/CompareContributor';

enum ContributorMergeOption {
  SourceOnly,
  TargetOnly,
  MergeBoth,
}

export const MergeResultsWizardContributorsTab = () => {
  const { t } = useTranslation();
  const { control, formState, setValue } = useFormContext<Registration>();
  const { sourceResult, sourceHeading } = useContext(MergeResultsWizardContext);
  const sourceContributors = sourceResult.entityDescription?.contributors ?? [];

  const targetContributors = useWatch({ name: 'entityDescription.contributors', control }) ?? [];
  const initialTargetContributors = (formState.defaultValues?.entityDescription?.contributors ?? []) as Contributor[];

  return (
    <>
      <RadioGroup
        sx={{ gridColumn: '1/-1', display: 'grid', gridTemplateColumns: 'subgrid' }}
        defaultValue={ContributorMergeOption.TargetOnly}>
        <div>
          <FormControlLabel
            data-testid={dataTestId.basicData.centralImport.mergeAllContributorsRadio}
            value={ContributorMergeOption.MergeBoth}
            control={<Radio />}
            onChange={() => {
              const mergedContributors = sourceContributors.reduce((acc, sourceContributor) => {
                const correspondingTargetContributor = sourceContributor.identity.id
                  ? acc.find((targetContributor) => targetContributor.identity.id === sourceContributor.identity.id)
                  : acc.find(
                      (targetContributor) => targetContributor.identity.name === sourceContributor.identity.name
                    );

                if (!correspondingTargetContributor) {
                  return [...acc, sourceContributor];
                }

                // Find affiliations from source that are not in target
                const allSourceAffiliations = sourceContributor.affiliations ?? [];
                const affiliationsToAdd = allSourceAffiliations.filter((sourceAffiliation) => {
                  if (sourceAffiliation.type === 'Organization' && sourceAffiliation.id) {
                    return !correspondingTargetContributor.affiliations?.some(
                      (targetAffiliation) =>
                        targetAffiliation.type === 'Organization' && targetAffiliation.id === sourceAffiliation.id
                    );
                  } else if (sourceAffiliation.type === 'UnconfirmedOrganization' && sourceAffiliation.name) {
                    return !correspondingTargetContributor.affiliations?.some(
                      (targetAffiliation) =>
                        targetAffiliation.type === 'UnconfirmedOrganization' &&
                        targetAffiliation.name === sourceAffiliation.name
                    );
                  }
                  return false;
                });

                // Update the corresponding target contributor with merged affiliations
                return acc.map((contributor) =>
                  contributor === correspondingTargetContributor
                    ? {
                        ...contributor,
                        affiliations: [...(contributor.affiliations ?? []), ...affiliationsToAdd],
                      }
                    : contributor
                );
              }, targetContributors);

              setValue('entityDescription.contributors', mergedContributors);
            }}
            label={t('keep_all_contributors', { sourceType: sourceHeading.toLocaleLowerCase() })}
          />
          <FormControlLabel
            data-testid={dataTestId.basicData.centralImport.keepContributorsFromSourceRadio}
            value={ContributorMergeOption.SourceOnly}
            control={<Radio />}
            onChange={() => setValue('entityDescription.contributors', sourceContributors)}
            label={t('keep_contributors_from_source_result', { sourceType: sourceHeading.toLocaleLowerCase() })}
          />
        </div>
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
