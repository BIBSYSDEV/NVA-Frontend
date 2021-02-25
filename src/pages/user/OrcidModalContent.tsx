import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, DialogActions, DialogContent, Typography } from '@material-ui/core';

import { ORCID_SIGN_IN_URL, USE_MOCK_DATA } from '../../utils/constants';
import { UrlPathTemplate } from '../../utils/urlPaths';

interface OrcidModalContentProps {
  cancelFunction: () => void;
  cancelText?: string;
}

const OrcidModalContent = ({ cancelFunction, cancelText }: OrcidModalContentProps) => {
  const { t } = useTranslation('profile');
  const history = useHistory();

  const openORCID = () => {
    if (USE_MOCK_DATA) {
      history.push(`${UrlPathTemplate.MyProfile}/#access_token=12343123`);
    } else {
      window.location.assign(ORCID_SIGN_IN_URL);
    }
  };

  return (
    <>
      <DialogContent>
        <Typography paragraph>{t('orcid.dialog.paragraph0')}</Typography>
        <Typography>{t('orcid.dialog.paragraph1')}</Typography>
      </DialogContent>
      <DialogActions>
        <Button data-testid="cancel-connect-to-orcid" color="default" variant="outlined" onClick={cancelFunction}>
          {cancelText ?? t('common:close')}
        </Button>
        <Button data-testid="connect-to-orcid" onClick={openORCID} color="secondary" variant="contained">
          {t('orcid.connect_orcid')}
        </Button>
      </DialogActions>
    </>
  );
};

export default OrcidModalContent;
