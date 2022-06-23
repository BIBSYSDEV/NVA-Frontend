import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, DialogActions, DialogContent, Typography } from '@mui/material';

import { ORCID_SIGN_IN_URL, USE_MOCK_DATA } from '../../../utils/constants';
import { UrlPathTemplate } from '../../../utils/urlPaths';

interface OrcidModalContentProps {
  cancelFunction: () => void;
  cancelText?: string;
}

export const OrcidModalContent = ({ cancelFunction, cancelText }: OrcidModalContentProps) => {
  const { t } = useTranslation('myPage');
  const history = useHistory();

  const openORCID = () => {
    if (USE_MOCK_DATA) {
      history.push(`${UrlPathTemplate.MyPageMyProfile}?access_token=123`);
      cancelFunction();
    } else {
      window.location.assign(ORCID_SIGN_IN_URL);
    }
  };

  return (
    <>
      <DialogContent>
        <Typography paragraph>{t('my_profile.orcid.dialog.paragraph0')}</Typography>
        <Typography>{t('my_profile.orcid.dialog.paragraph1')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button data-testid="cancel-connect-to-orcid" variant="outlined" onClick={cancelFunction}>
          {cancelText ?? t('common:close')}
        </Button>
        <Button data-testid="connect-to-orcid" onClick={openORCID} variant="contained">
          {t('my_profile.orcid.connect_orcid')}
        </Button>
      </DialogActions>
    </>
  );
};
