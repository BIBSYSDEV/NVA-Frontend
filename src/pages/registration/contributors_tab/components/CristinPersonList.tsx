import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Radio } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { SearchResponse } from '../../../../types/common.types';
import { CristinUser } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getFullCristinName } from '../../../../utils/user-helpers';

interface CristinPersonListProps {
  personSearch: SearchResponse<CristinUser>;
  searchTerm?: string;
  onSelectContributor?: (selectedContributor: CristinUser) => void;
  selectedArpId?: string;
}

export const CristinPersonList = ({
  personSearch,
  searchTerm,
  onSelectContributor,
  selectedArpId,
}: CristinPersonListProps) => {
  const { t } = useTranslation('common');

  return (
    <>
      {searchTerm && (
        <Typography variant="subtitle1" component="p">
          {t('search_summary', { count: personSearch.size, searchTerm })}:
        </Typography>
      )}

      <TableContainer>
        <Table size="medium">
          <caption>
            <span style={visuallyHidden}>{t('registration:contributors.authors')}</span>
          </caption>
          <TableHead>
            <TableRow>
              <TableCell id="selected-heading" padding="checkbox">
                {t('common:selected')}
              </TableCell>
              <TableCell data-testid="author-name-column">{t('name')}</TableCell>
              <TableCell data-testid="author-organizations-column">{t('profile:heading.affiliations')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {personSearch.hits.map((cristinUser) => {
              const activeAffiliations = cristinUser.affiliations.filter((affiliation) => affiliation.active);
              return (
                <TableRow
                  sx={{ cursor: 'pointer' }}
                  data-testid={dataTestId.registrationWizard.contributors.authorRadioButton}
                  key={cristinUser.id}
                  hover
                  onClick={() => onSelectContributor?.(cristinUser)}
                  selected={cristinUser.id === selectedArpId}>
                  <TableCell padding="checkbox">
                    <Radio
                      inputProps={{ 'aria-labelledby': 'selected-heading' }}
                      checked={cristinUser.id === selectedArpId}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography>{getFullCristinName(cristinUser.names)}</Typography>
                  </TableCell>
                  <TableCell>
                    {activeAffiliations.length > 0 ? (
                      <>
                        <AffiliationHierarchy unitUri={activeAffiliations[0].organization} commaSeparated />
                        {activeAffiliations.length > 1 && (
                          <i>{t('profile:authority.other_affiliations', { count: activeAffiliations.length - 1 })}</i>
                        )}
                      </>
                    ) : (
                      <i>{t('profile:authority.no_affiliations_found')}</i>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
