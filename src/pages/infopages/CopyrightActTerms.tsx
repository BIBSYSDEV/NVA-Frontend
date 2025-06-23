import { Divider, Typography } from '@mui/material';
import { useHead } from '@unhead/react';
import { Trans, useTranslation } from 'react-i18next';
import { OpenInNewLink } from '../../components/OpenInNewLink';
import { BackgroundDiv } from '../../components/styled/Wrappers';

const CopyrightActTerms = () => {
  const { t } = useTranslation();

  useHead({
    title: t('licenses.labels.copyright_act'),
    bodyAttrs: {
      about: window.location.href,
      vocab: 'http://creativecommons.org/ns#',
      typeof: 'License',
    } as any, // Must use any since the type does not include RDF attributes atm
  });

  return (
    <BackgroundDiv sx={{ maxWidth: '45rem', my: '2rem' }}>
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
