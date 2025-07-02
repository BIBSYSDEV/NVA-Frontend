import { Divider, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { DocumentHeadTitle } from '../../components/DocumentHeadTitle';
import { OpenInNewLink } from '../../components/OpenInNewLink';
import { BackgroundDiv } from '../../components/styled/Wrappers';

const CopyrightActTerms = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.body.setAttribute('about', window.location.href);
    document.body.setAttribute('vocab', 'http://creativecommons.org/ns#');
    document.body.setAttribute('typeof', 'License');

    return () => {
      document.body.removeAttribute('about');
      document.body.removeAttribute('vocab');
      document.body.removeAttribute('typeof');
    };
  }, []);

  return (
    <BackgroundDiv sx={{ maxWidth: '45rem', my: '2rem' }}>
      <DocumentHeadTitle>{t('licenses.labels.copyright_act')}</DocumentHeadTitle>
      <Trans
        i18nKey="licenses.terms_of_use_under_the_copyright_act"
        components={{
          h1: <Typography variant="h1" gutterBottom />,
          p: <Typography sx={{ my: '1rem' }} />,
          link1: <OpenInNewLink href="https://lovdata.no/lov/2018-06-15-40" />,
          link2: (
            <OpenInNewLink href="https://sikt.no/om-sikt/kontakt-oss?service=e588691c-22eb-49c3-ac50-755f5513a3f5#skjema" />
          ),
          ul: <ul />,
          li: <li />,
          hr: <Divider sx={{ my: '1.5rem', bgcolor: 'primary.main', height: '1px', width: '40%', mx: 'auto' }} />,
        }}
      />
    </BackgroundDiv>
  );
};

export default CopyrightActTerms;
