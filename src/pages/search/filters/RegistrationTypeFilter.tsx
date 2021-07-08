import { ListItem, ListSubheader } from '@material-ui/core';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { JournalType } from '../../../types/publicationFieldNames';
import { BaseFilterItem } from './BaseFilterItem';

const StyledIndentedListItem = styled(ListItem)`
  padding-left: 2rem;
`;

export const RegistrationTypeFilter = () => {
  const { t } = useTranslation('publicationTypes');

  return (
    <BaseFilterItem title="Registration Type">
      <ListSubheader disableSticky>{t('Journal')}</ListSubheader>
      {Object.values(JournalType).map((type) => (
        <StyledIndentedListItem key={type} button>
          {t(type)}
        </StyledIndentedListItem>
      ))}
    </BaseFilterItem>
  );
};
