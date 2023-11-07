import { Box, List, Typography } from '@mui/material';
import { UseQueryResult } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { SearchResponse } from '../../../types/common.types';
import { CristinPerson } from '../../../types/user.types';
import { CristinSearchPagination } from '../CristinSearchPagination';
import { PersonListItem } from './PersonListItem';

interface PersonSearchProps {
  personQuery: UseQueryResult<SearchResponse<CristinPerson, unknown, unknown>>;
}

export const PersonSearch = ({ personQuery }: PersonSearchProps) => {
  const { t } = useTranslation();

  const searchResults = personQuery.data?.hits ?? [];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {personQuery.isLoading ? (
        <ListSkeleton arrayLength={3} minWidth={40} height={100} />
      ) : searchResults && searchResults.length > 0 ? (
        <div>
          <List>
            {searchResults.map((person) => (
              <PersonListItem key={person.id} person={person} />
            ))}
          </List>
          <CristinSearchPagination totalCount={personQuery.data?.size ?? 0} />
        </div>
      ) : (
        <Typography>{t('common.no_hits')}</Typography>
      )}
    </Box>
  );
};
