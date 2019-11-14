import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import mockContributors from '../../utils/testfiles/contributors.json';
import { USE_MOCK_DATA } from '../../utils/constants';

import TabPanel from '../../components/TabPanel/TabPanel';
import { contributorReducer } from '../../redux/reducers/contributorReducer';
import { RootStore } from '../../redux/reducers/rootReducer';
import Contributor from './contributors/Contributor';
import ContributorLabel from './contributors/ContributorLabel';
import ContributorValidator from './contributors/ContributorValidator';
import StyledContributor from './contributors/StyledComponents';
import OtherContributor from './contributors/OtherContributor';
import { addContributor } from '../../redux/actions/contributorActions';
import { emptyContributor } from './../../types/contributor.types';

interface ContributorsPanelProps {
  onClick: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const ContributorsPanel: React.FC<ContributorsPanelProps> = ({ onClick, tabNumber }) => {
  const { t } = useTranslation();
  const errors = useSelector((store: RootStore) => store.errors);
  const initialState = USE_MOCK_DATA ? mockContributors : [];
  const [contributors, dispatch] = useReducer(contributorReducer, initialState);
  const [idCounter, setIdCounter] = useState(contributors.length);

  const onAddOtherContributor = () => {
    setIdCounter(idCounter + 1);
    const newContributor = {
      ...emptyContributor,
      ...{ id: 'c' + idCounter, type: '' },
    };
    dispatch(addContributor(newContributor));
  };

  const onAddAuthor = () => {
    setIdCounter(idCounter + 1);
    const newContributor = {
      ...emptyContributor,
      ...{ type: 'Author', id: 'c' + idCounter },
    };
    dispatch(addContributor(newContributor));
  };

  return (
    <TabPanel
      isHidden={tabNumber !== 3}
      ariaLabel="references"
      onClick={onClick}
      errors={errors.contributorsErrors}
      heading="Contributors">
      <StyledContributor.Box>
        <StyledContributor.MainHeading>{t('contributors.authors')}</StyledContributor.MainHeading>
        <StyledContributor.ContributorContainer>
          <div className="contributor-icon" />
          <ContributorLabel>{t('contributors.name')}</ContributorLabel>
          <ContributorLabel>{t('contributors.institution')}</ContributorLabel>
          <ContributorLabel>{t('contributors.corresponding')}</ContributorLabel>
          <ContributorLabel>{t('contributors.ORCID')}</ContributorLabel>
          <div className="contributor-delete-icon" />
        </StyledContributor.ContributorContainer>
        {contributors
          .filter(contributor => contributor.type === 'Author')
          .map(contributor => (
            <Contributor contributor={contributor} key={contributor.id} dispatch={dispatch} />
          ))}
        <ContributorValidator />
        <StyledContributor.AuthorsButton variant="text" startIcon={<StyledContributor.AddIcon />} onClick={onAddAuthor}>
          {t('contributors.add_author')}
        </StyledContributor.AuthorsButton>
      </StyledContributor.Box>
      <StyledContributor.Box>
        <StyledContributor.MainHeading>Bidragsytere</StyledContributor.MainHeading>
        {contributors
          .filter(contributor => contributor.type !== 'Author')
          .map(contributor => (
            <OtherContributor contributor={contributor} key={contributor.id} dispatch={dispatch} />
          ))}
        <StyledContributor.AuthorsButton
          variant="text"
          startIcon={<StyledContributor.AddIcon />}
          onClick={onAddOtherContributor}>
          {t('contributors.add_other_contributor')}
        </StyledContributor.AuthorsButton>
      </StyledContributor.Box>
    </TabPanel>
  );
};

export default ContributorsPanel;
