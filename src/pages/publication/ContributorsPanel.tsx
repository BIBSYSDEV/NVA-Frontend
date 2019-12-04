import React, { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import TabPanel from '../../components/TabPanel/TabPanel';
import { addContributor } from '../../redux/actions/contributorActions';
import { contributorReducer } from '../../redux/reducers/contributorReducer';
import { RootStore } from '../../redux/reducers/rootReducer';
import { emptyContributor } from '../../types/contributor.types';
import { USE_MOCK_DATA } from '../../utils/constants';
import mockContributors from '../../utils/testfiles/contributors.json';
import Contributors from './contributors_tab/Contributors';
import OtherContributors from './contributors_tab/OtherContributors';

interface ContributorsPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  savePublication: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const ContributorsPanel: React.FC<ContributorsPanelProps> = ({ goToNextTab, tabNumber, savePublication }) => {
  const { t } = useTranslation('publication');
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
      goToNextTab={goToNextTab}
      onClickSave={savePublication}
      errors={errors.contributorsErrors}
      heading={t('heading.contributors')}>
      <Contributors contributors={contributors} dispatch={dispatch} onAddAuthor={onAddAuthor} />
      <OtherContributors
        contributors={contributors}
        dispatch={dispatch}
        onAddOtherContributor={onAddOtherContributor}
      />
    </TabPanel>
  );
};

export default ContributorsPanel;
