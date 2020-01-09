import React from 'react';
import { useTranslation } from 'react-i18next';

import ContributorType, { emptyContributor } from '../../../types/contributor.types';
import Contributor from './Contributor';
import ContributorLabel from './ContributorLabel';
import ContributorValidator from './ContributorValidator';
import StyledContributor from './StyledContributor';
import { FieldArray, useFormikContext } from 'formik';

interface ContributorsProps {}

const Contributors: React.FC<ContributorsProps> = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext();

  return (
    <StyledContributor.Box>
      <StyledContributor.MainHeading>{t('publication:contributors.authors')}</StyledContributor.MainHeading>
      <StyledContributor.ContributorContainer>
        <ContributorLabel>{t('common:name')}</ContributorLabel>
        <ContributorLabel>{t('common:institution')}</ContributorLabel>
        <ContributorLabel>{t('publication:contributors.corresponding')}</ContributorLabel>
        <ContributorLabel>{t('common:orcid')}</ContributorLabel>
      </StyledContributor.ContributorContainer>

      <FieldArray name="authors">
        {({ swap, push, remove }) => {
          return (
            <div>
              {values.authors.map((author: ContributorType, index: number) =>
                author.verified ? (
                  <Contributor contributor={author} key={author.id} index={index} swap={swap} remove={remove} />
                ) : (
                  <ContributorValidator
                    contributor={author}
                    key={author.id}
                    index={index}
                    swap={swap}
                    remove={remove}
                  />
                )
              )}
              <StyledContributor.AuthorsButton
                variant="text"
                startIcon={<StyledContributor.AddIcon />}
                onClick={() => push(emptyContributor)}>
                {t('publication:contributors.add_author')}
              </StyledContributor.AuthorsButton>
            </div>
          );
        }}
      </FieldArray>
    </StyledContributor.Box>
  );
};

export default Contributors;
