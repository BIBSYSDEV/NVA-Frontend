import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { CristinApiPath } from '../../../api/apiPaths';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import { FlatCristinUser, CristinUser } from '../../../types/user.types';
import { isSuccessStatus } from '../../../utils/constants';
import { getLanguageString } from '../../../utils/translation-helpers';
import { convertToFlatCristinUser } from '../../../utils/user-helpers';

interface AddAdminDialogProps extends Pick<DialogProps, 'open'> {
  toggleOpen: () => void;
}

export const AddAdminDialog = ({ open, toggleOpen }: AddAdminDialogProps) => {
  const { t } = useTranslation('admin');
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [cristinUser, setCristinUser] = useState<FlatCristinUser>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Search when user has entered 11 chars as a Norwegian National ID is 11 chars long
    if (nationalIdNumber.length === 11) {
      const searchByNationalId = async () => {
        setIsLoading(true);
        const searchResponse = await authenticatedApiRequest<CristinUser>({
          url: CristinApiPath.PersonIdentityNumer,
          method: 'POST',
          data: {
            type: 'NationalIdentificationNumber',
            value: nationalIdNumber,
          },
        });
        if (isSuccessStatus(searchResponse.status)) {
          setCristinUser(convertToFlatCristinUser(searchResponse.data));
        }
        setIsLoading(false);
      };

      searchByNationalId();
    } else {
      setCristinUser(undefined);
    }
  }, [nationalIdNumber]);

  const addAdmin = () => {
    // TODO: Add (Cristin) employment
    // TODO: Create NVA User, and admin role
    toggleOpen();
  };

  return (
    <Dialog open={open} onClose={toggleOpen}>
      <DialogTitle>{t('common:add_custom', { name: t('profile:roles.institution_admin') })}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: '1rem' }}>
          <TextField
            variant="filled"
            label={t('basicData:search_for_national_id')}
            sx={{ minWidth: '20rem' }}
            onChange={(event) => event.target.value.length <= 11 && setNationalIdNumber(event.target.value)}
            InputProps={{
              endAdornment: <SearchIcon color="disabled" />,
            }}
          />
          {isLoading ? (
            <CircularProgress />
          ) : cristinUser ? (
            <>
              <Typography variant="h3" component="p" sx={{ mt: '1rem' }}>
                {cristinUser.firstName} {cristinUser.lastName}
              </Typography>
              <Box component="ul" sx={{ my: 0, pl: '1rem' }}>
                {cristinUser.affiliations.map((affiliation) => {
                  const roleString = getLanguageString(affiliation.role.labels);
                  return (
                    <li key={affiliation.organization}>
                      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        {roleString && <Typography>{roleString}:</Typography>}
                        <AffiliationHierarchy unitUri={affiliation.organization} commaSeparated />
                      </Box>
                    </li>
                  );
                })}
              </Box>
            </>
          ) : null}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleOpen}>{t('common:cancel')}</Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled={!cristinUser || nationalIdNumber.length !== 11}
          onClick={addAdmin}>
          {t('common:add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
