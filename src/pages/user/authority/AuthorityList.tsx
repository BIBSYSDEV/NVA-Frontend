import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Radio, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import BackgroundDiv from '../../../components/BackgroundDiv';
import AffiliationHierarchy from '../../../components/institution/AffiliationHierarchy';
import lightTheme from '../../../themes/lightTheme';
import { Authority } from '../../../types/authority.types';
import useFetchLastRegistrationFromAlma from '../../../utils/hooks/useFetchLastRegistration';

const StyledTableRow = styled(TableRow)`
  cursor: pointer;
`;

const StyledTableCell = styled(TableCell)`
  min-width: 15rem;
`;

interface AuthorityListProps {
  authorities: Authority[];
  searchTerm?: string;
  onSelectAuthority?: (authority: Authority) => void;
  selectedArpId?: string;
}

const AuthorityList = ({ authorities, searchTerm, onSelectAuthority, selectedArpId }: AuthorityListProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      {searchTerm && (
        <Typography variant="subtitle2" component="p">
          {t('search_summary', { count: authorities?.length ?? 0, searchTerm })}:
        </Typography>
      )}

      <BackgroundDiv backgroundColor={lightTheme.palette.section.megaLight}>
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell id="selected-heading" padding="checkbox">
                  {t('common:selected')}
                </TableCell>
                <StyledTableCell data-testid="author-name-column">{t('name')}</StyledTableCell>
                <StyledTableCell data-testid="author-last-registration-column">
                  {t('profile:authority.example_publication')}
                </StyledTableCell>
                <StyledTableCell data-testid="author-organizations-column">
                  {t('profile:heading.affiliations')}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authorities.map((authority) => (
                <StyledTableRow
                  data-testid="author-radio-button"
                  key={authority.id}
                  hover
                  onClick={() => onSelectAuthority?.(authority)}
                  selected={authority.id === selectedArpId}>
                  <TableCell padding="checkbox">
                    <Radio
                      inputProps={{ 'aria-labelledby': 'selected-heading' }}
                      checked={authority.id === selectedArpId}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>{authority.name}</Typography>
                  </TableCell>
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
      </BackgroundDiv>
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
        <Typography>{almaPublication.title}</Typography>
      ) : (
        <i>{t('authority.no_registrations_found')}</i>
      )}
    </>
  );
};

export default AuthorityList;
