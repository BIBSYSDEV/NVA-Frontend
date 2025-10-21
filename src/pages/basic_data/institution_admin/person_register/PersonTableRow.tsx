import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import OrcidLogo from '../../../../resources/images/orcid_logo.svg';
import { CristinPerson, Employment, RoleName } from '../../../../types/user.types';
import { ORCID_BASE_URL } from '../../../../utils/constants';
import { dataTestId } from '../../../../utils/dataTestIds';
import {
  convertToFlatCristinPerson,
  getFullCristinName,
  getMaskedNationalIdentityNumber,
  isActiveEmployment,
} from '../../../../utils/user-helpers';
import { UserFormDialog } from '../edit_user/UserFormDialog';

export interface PersonData {
  employments: Employment[];
  roles: RoleName[];
}

interface PersonTableRowProps {
  cristinPerson: CristinPerson;
  refetchEmployees: () => void;
}

export const PersonTableRow = ({ cristinPerson, refetchEmployees }: PersonTableRowProps) => {
  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => {
    if (openDialog) {
      refetchEmployees();
    }
    setOpenDialog(!openDialog);
  };

  const { cristinIdentifier, employments, orcid, nationalId } = convertToFlatCristinPerson(cristinPerson);
  const orcidUrl = orcid ? `${ORCID_BASE_URL}/${orcid}` : '';

  const fullName = getFullCristinName(cristinPerson.names);
  const activeEmployments = employments.filter(isActiveEmployment);

  return (
    <>
      <TableRow onClick={toggleDialog} sx={{ cursor: 'pointer' }}>
        <TableCell data-testid={dataTestId.basicData.personAdmin.cristinId(cristinIdentifier)}>
          {cristinIdentifier}
        </TableCell>
        <TableCell data-testid={dataTestId.basicData.personAdmin.nin(cristinIdentifier)}>
          {getMaskedNationalIdentityNumber(nationalId)}
        </TableCell>
        <TableCell width="25%" data-testid={dataTestId.basicData.personAdmin.name(cristinIdentifier)}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{fullName}</Typography>
            {orcidUrl && (
              <Tooltip title={t('common.orcid_profile')}>
                <IconButton size="small" href={orcidUrl} target="_blank">
                  <img src={OrcidLogo} height="20" alt="orcid" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </TableCell>
        <TableCell width="60%" data-testid={dataTestId.basicData.personAdmin.employments(cristinIdentifier)}>
          <Box component="ul" sx={{ p: 0 }}>
            {activeEmployments.map((employment, index) => (
              <Box key={`${employment.organization}-${index}`} component="li" sx={{ display: 'flex' }}>
                <AffiliationHierarchy unitUri={employment.organization} commaSeparated />
              </Box>
            ))}
          </Box>
        </TableCell>
        <TableCell>
          <Tooltip title={t('common.edit')}>
            <IconButton
              sx={{ bgcolor: 'tertiary.main' }}
              data-testid={dataTestId.basicData.editPersonButton(cristinIdentifier)}>
              <EditIcon color="primary" fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <UserFormDialog open={openDialog} onClose={toggleDialog} existingPerson={cristinPerson} />
    </>
  );
};
