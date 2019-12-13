import React from 'react';
import { useTranslation } from 'react-i18next';

import ContributorType from '../../../types/contributor.types';
import ContributorLabel from './ContributorLabel';
import OtherContributor from './OtherContributor';
import StyledContributor from './StyledContributor';
import { emptyContributor } from './../../../types/contributor.types';
import { FieldArray } from 'formik';

interface OtherContributorsProps {}

const OtherContributors: React.FC<OtherContributorsProps> = () => {
  const { t } = useTranslation();

  return (
    <StyledContributor.Box>
      <StyledContributor.MainHeading>Bidragsytere</StyledContributor.MainHeading>

      <StyledContributor.OtherContributorContainer>
        <ContributorLabel>{t('publication:contributors.type')}</ContributorLabel>
        <ContributorLabel>{t('common:name')}</ContributorLabel>
        <ContributorLabel>{t('common:institution')}</ContributorLabel>
        <div className="contributor-delete-icon" />
      </StyledContributor.OtherContributorContainer>

      <FieldArray name="contributors.contributors">
        {({ swap, push, remove, form: { values, setFieldValue } }) => {
          return (
            <div>
              {values.contributors?.contributors.map((contributor: ContributorType, index: number) => (
                <OtherContributor
                  contributor={contributor}
                  key={contributor.id}
                  index={index}
                  remove={remove}
                  swap={swap}
                  setFieldValue={setFieldValue}
                />
              ))}
              <StyledContributor.AuthorsButton
                variant="text"
                startIcon={<StyledContributor.AddIcon />}
                onClick={() => push({ ...emptyContributor })}>
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
