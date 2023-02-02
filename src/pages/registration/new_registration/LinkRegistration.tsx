import { useState, ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { AccordionActions, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/LinkOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useDispatch } from 'react-redux';
import { getRegistrationByDoi } from '../../../api/registrationApi';
import { LinkRegistrationForm } from './LinkRegistrationForm';
import { RegistrationAccordion } from './RegistrationAccordion';
import { Doi } from '../../../types/registration.types';
import { setNotification } from '../../../redux/notificationSlice';
import { getRegistrationWizardPath } from '../../../utils/urlPaths';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { stringIncludesMathJax, typesetMathJax } from '../../../utils/mathJaxHelpers';

export interface StartRegistrationAccordionProps {
  expanded: boolean;
  onChange: (event: ChangeEvent<unknown>, isExpanded: boolean) => void;
}

export const LinkRegistration = ({ expanded, onChange }: StartRegistrationAccordionProps) => {
  const { t } = useTranslation();
  const [doi, setDoi] = useState<Doi | null>(null);
  const [noHit, setNoHit] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const openRegistration = async () => {
    if (!doi) {
      return;
    }
    history.push(getRegistrationWizardPath(doi.identifier), { highestValidatedTab: -1 });
  };

  const handleSearch = async (doiUrl: string) => {
    setNoHit(false);
    setDoi(null);

    try {
      const doiRegistrationResponse = await getRegistrationByDoi(doiUrl);
      if (isErrorStatus(doiRegistrationResponse.status)) {
        setNoHit(true);
        dispatch(setNotification({ message: t('feedback.error.get_doi'), variant: 'error' }));
      } else if (isSuccessStatus(doiRegistrationResponse.status)) {
        if (doiRegistrationResponse.data) {
          setDoi(doiRegistrationResponse.data);
        } else {
          setNoHit(true);
        }
      }
    } catch {
      setNoHit(true);
      dispatch(setNotification({ message: t('feedback.error.get_doi'), variant: 'error' }));
    }
  };

  useEffect(() => {
    if (stringIncludesMathJax(doi?.title)) {
      typesetMathJax();
    }
  }, [doi?.title]);

  return (
    <RegistrationAccordion elevation={5} expanded={expanded} onChange={onChange}>
      <AccordionSummary
        data-testid={dataTestId.registrationWizard.new.linkAccordion}
        expandIcon={<ExpandMoreIcon fontSize="large" />}>
        <LinkIcon />
        <div>
          <Typography variant="h2">{t('registration.registration.start_with_link_to_resource_title')}</Typography>
          <Typography>{t('registration.registration.start_with_link_to_resource_description')}</Typography>
        </div>
      </AccordionSummary>

      <AccordionDetails>
        <LinkRegistrationForm handleSearch={handleSearch} />
        {noHit && <Typography sx={{ mt: '1rem' }}>{t('common.no_hits')}</Typography>}
        {doi && (
          <div data-testid={dataTestId.registrationWizard.new.linkMetadata}>
            <Typography sx={{ mt: '1rem' }} variant="h3" gutterBottom>
              {t('common.registration')}:
            </Typography>
            <Typography>{doi.title}</Typography>
          </div>
        )}
      </AccordionDetails>

      <AccordionActions>
        <Button
          data-testid={dataTestId.registrationWizard.new.startRegistrationButton}
          endIcon={<ArrowForwardIcon fontSize="large" />}
          variant="contained"
          disabled={!doi}
          onClick={openRegistration}>
          {t('registration.registration.start_registration')}
        </Button>
      </AccordionActions>
    </RegistrationAccordion>
  );
};
