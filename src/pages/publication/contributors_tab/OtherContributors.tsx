import React from 'react';
import { useTranslation } from 'react-i18next';

import ContributorType, { emptyContributor } from '../../../types/contributor.types';
import ContributorLabel from './ContributorLabel';
import OtherContributor from './OtherContributor';
import StyledContributor from './StyledContributor';
import { FieldArray, useFormikContext } from 'formik';

interface OtherContributorsProps {}

const OtherContributors: React.FC<OtherContributorsProps> = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext();

  return (
    <StyledContributor.Box>
      <StyledContributor.MainHeading>Bidragsytere</StyledContributor.MainHeading>

      <StyledContributor.OtherContributorContainer>
        <ContributorLabel>{t('publication:contributors.type')}</ContributorLabel>
        <ContributorLabel>{t('common:name')}</ContributorLabel>
        <ContributorLabel>{t('common:institution')}</ContributorLabel>
        <div className="contributor-delete-icon" />
      </StyledContributor.OtherContributorContainer>

      <FieldArray name="contributors">
        {({ swap, push, remove }) => {
          return (
            <div>
              {values.contributors.map((contributor: ContributorType, index: number) => (
                <OtherContributor
                  contributor={contributor}
                  key={contributor.id}
                  index={index}
                  remove={remove}
                  swap={swap}
                />
              ))}
              <StyledContributor.AuthorsButton
                variant="text"
                startIcon={<StyledContributor.AddIcon />}
                onClick={() => push(emptyContributor)}>
                {t('publication:contributors.add_other_contributor')}
              </StyledContributor.AuthorsButton>
            </div>
          );
        }}
      </FieldArray>
    </StyledContributor.Box>
  );
};

export default OtherContributors;
