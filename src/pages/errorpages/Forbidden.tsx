import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as MuiLink, CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import Heading from '../../components/Heading';
import NormalText from '../../components/NormalText';
import { StyledProgressWrapper } from '../../components/styled/Wrappers';
import { LOAD_ERROR_PAGE_AFTER_DURATION } from '../../utils/constants';

const StyledLinkText = styled(NormalText)`
  margin-top: 1rem;
`;

const Forbidden: FC = () => {
  const { t } = useTranslation('authorization');
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSpinner(false);
    }, [LOAD_ERROR_PAGE_AFTER_DURATION]);
  }, []);

  return (
    <section>
      {showSpinner ? (
        <StyledProgressWrapper>
          <CircularProgress color="primary" size={100} />
        </StyledProgressWrapper>
      ) : (
        <>
          <Heading>{t('forbidden')}</Heading>
          <NormalText>{t('forbidden_description')}</NormalText>
          <MuiLink component={Link} to="/">
            <StyledLinkText>{t('back_to_home')}</StyledLinkText>
          </MuiLink>
        </>
      )}
    </section>
  );
};

export default Forbidden;
