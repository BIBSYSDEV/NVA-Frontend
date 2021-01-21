import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Authority } from '../../../types/authority.types';
import Label from '../../../components/Label';
import { Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import useFetchLastRegistrationFromAlma from '../../../utils/hooks/useFetchLastRegistration';
import { Skeleton } from '@material-ui/lab';
import Truncate from 'react-truncate';
import AffiliationHierarchy from '../../../components/institution/AffiliationHierarchy';

const StyledTableRow = styled(TableRow)`
  cursor: pointer;
`;

interface AuthorityListProps {
  authorities: Authority[];
  searchTerm: string;
  onSelectAuthority: (authority: Authority) => void;
  selectedArpId?: string;
}

const AuthorityList: FC<AuthorityListProps> = ({ authorities, searchTerm, onSelectAuthority, selectedArpId }) => {
  const { t } = useTranslation('common');

  return (
    <>
      <Label>{t('search_summary', { count: authorities?.length ?? 0, searchTerm })}</Label>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>{t('name')}</TableCell>
              <TableCell>{t('last_registration')}</TableCell>
              <TableCell>{t('profile:heading.organizations')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authorities.map((authority) => (
              <StyledTableRow
                data-testid="author-radio-button"
                key={authority.id}
                hover
                onClick={() => onSelectAuthority(authority)}
                selected={authority.id === selectedArpId}>
                <TableCell padding="checkbox">
                  <Radio checked={authority.id === selectedArpId} />
                </TableCell>
                <TableCell>{authority.name}</TableCell>
                <TableCell>
                  <LastAlmaRegistrationCell authority={authority} />
                </TableCell>
                <TableCell>
                  {authority.orgunitids.length > 0 ? (
                    <>
                      <AffiliationHierarchy unitUri={authority.orgunitids[0]} boldTopLevel={false} />
                      {authority.orgunitids.length > 1 && (
                        <i>{t('profile:authority.other_affiliations', { count: authority.orgunitids.length - 1 })}</i>
                      )}
                    </>
                  ) : (
                    <i>{t('profile:authority.no_affiliations_found')}</i>
                  )}
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

interface LastAlmaRegistrationCellProps {
  authority: Authority;
}

const LastAlmaRegistrationCell = ({ authority }: LastAlmaRegistrationCellProps) => {
  const { t } = useTranslation('profile');
  const [almaPublication, isLoadingAlmaPublication] = useFetchLastRegistrationFromAlma(authority.id, authority.name);

  return (
    <>
      {isLoadingAlmaPublication ? (
        <Skeleton width="70%" />
      ) : almaPublication?.title ? (
        <Truncate lines={2}>{almaPublication.title}</Truncate>
      ) : (
        <i>{t('authority.no_registrations_found')}</i>
      )}
    </>
  );
};

export default AuthorityList;
