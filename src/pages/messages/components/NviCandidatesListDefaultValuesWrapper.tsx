import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router';
import { NviCandidatesSearchParam } from '../../../api/searchApi';
import { RootState } from '../../../redux/store';
import { NviCandidateSearchStatus } from '../../../types/nvi.types';

interface NviCandidatesListDefaultValuesWrapperProps {
  children: ReactNode;
}

export const NviCandidatesListDefaultValuesWrapper = ({ children }: NviCandidatesListDefaultValuesWrapperProps) => {
  const user = useSelector((store: RootState) => store.user);
  const nvaUsername = user?.nvaUsername ?? '';

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.size > 0 || !nvaUsername) {
      return;
    }

    setSearchParams(
      (prevParams) => {
        prevParams.set(NviCandidatesSearchParam.Assignee, nvaUsername);
        prevParams.set(NviCandidatesSearchParam.Filter, 'assigned' satisfies NviCandidateSearchStatus);
        return prevParams;
      },
      { replace: true }
    );
  }, [setSearchParams, searchParams, nvaUsername]);

  return children;
};
