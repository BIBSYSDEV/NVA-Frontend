import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import OrcidLogo from '../../../../resources/images/orcid_logo.svg';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { ORCID_BASE_URL } from '../../../../utils/constants';
import { convertToFlatCristinUser, filterActiveAffiliations } from '../../../../utils/user-helpers';
import { CristinUser } from '../../../../types/user.types';

interface PersonTableRowProps {
  cristinPerson: CristinUser;
}

export const PersonTableRow = ({ cristinPerson }: PersonTableRowProps) => {
  const { t } = useTranslation('basicData');
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDialog = () => setOpenDialog(!openDialog);

  const { cristinIdentifier, firstName, lastName, affiliations, orcid } = convertToFlatCristinUser(cristinPerson);
  const activeEmployments = filterActiveAffiliations(affiliations);
  const orcidUrl = orcid ? `${ORCID_BASE_URL}/${orcid}` : '';

  return (
    <TableRow>
      <TableCell>{cristinIdentifier}</TableCell>
      <TableCell>
        {firstName} {lastName}
        {orcidUrl && (
          <Tooltip title={t<string>('common:orcid_profile')}>
            <IconButton size="small" href={orcidUrl} target="_blank">
              <img src={OrcidLogo} height="20" alt="orcid" />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
      <TableCell>
        <Box component="ul" sx={{ p: 0 }}>
          {activeEmployments.map((employment, index) => (
            <Box key={`${employment.organization}-${index}`} component="li" sx={{ display: 'flex' }}>
              <AffiliationHierarchy unitUri={employment.organization} commaSeparated />
            </Box>
          ))}
        </Box>
      </TableCell>
      <TableCell>
        <Tooltip title={t('common:edit')}>
          <IconButton onClick={toggleDialog}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
      <Dialog open={openDialog} onClose={toggleDialog}>
        <DialogTitle>{t('person_register.edit_person')}</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>{t('common:cancel')}</Button>
          <Button variant="contained">{t('common:save')}</Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
};
