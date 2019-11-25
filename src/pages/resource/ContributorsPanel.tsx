import React, { useReducer, useState } from 'react';
import { useSelector } from 'react-redux';

import TabPanel from '../../components/TabPanel/TabPanel';
import { addContributor } from '../../redux/actions/contributorActions';
import { contributorReducer } from '../../redux/reducers/contributorReducer';
import { RootStore } from '../../redux/reducers/rootReducer';
import { emptyContributor } from '../../types/contributor.types';
import { USE_MOCK_DATA } from '../../utils/constants';
import mockContributors from '../../utils/testfiles/contributors.json';
import Contributors from './contributors/Contributors';
import OtherContributors from './contributors/OtherContributors';

interface ContributorsPanelProps {
  goToNextTab: (event: React.MouseEvent<any>) => void;
  saveResource: (event: React.MouseEvent<any>) => void;
  tabNumber: number;
}

const ContributorsPanel: React.FC<ContributorsPanelProps> = ({ goToNextTab, tabNumber, saveResource }) => {
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
      onClickSave={saveResource}
      errors={errors.contributorsErrors}
      heading="Contributors">
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
