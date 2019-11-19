import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import LinkIcon from '@material-ui/icons/Link';

import PublicationExpansionPanel from './PublicationExpansionPanel';
import styled from 'styled-components';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { createNewResourceFromDoi, lookupDoiTitle } from '../../api/resource';
import { useDispatch, useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import Axios from 'axios';
import { ApiBaseUrl, StatusCode } from '../../utils/constants';

const StyledInputBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
`;

const StyledTextField = styled(Field)`
  margin-right: 1rem;
`;

const StyledBody = styled.div`
  width: 100%;
`;

const StyledHeading = styled.div`
  font-size: 1.2rem;
  padding: 10px 0;
`;

const StyledTitle = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
`;

interface LinkPublicationPanelProps {
  expanded: boolean;
  onChange: (event: React.ChangeEvent<any>, isExpanded: boolean) => void;
  goToNextTab: () => void;
}

const LinkPublicationPanel: React.FC<LinkPublicationPanelProps> = ({ expanded, onChange, goToNextTab }) => {
  const { t } = useTranslation();
  const [doiUrl, setDoiUrl] = useState('');
  const [doiTitle, setDoiTitle] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state: RootStore) => state.user);

  const resourceSchema = Yup.object().shape({
    doiUrl: Yup.string()
      .url(t('resource_form.feedback.invalid_url'))
      .required(t('resource_form.feedback.required_field')),
  });

  const handleConfirmDOIMetadata = () => {
    dispatch(createNewResourceFromDoi(doiUrl, user.id));
    goToNextTab();
  };

  const handleSearch = async (values: any) => {
    // const title = dispatch(lookupDoiTitle(values.doiUrl));
    // setDoiTitle(title);
    const title = await lookupDoiTitle(values.doiUrl);
    setDoiTitle(title);
    setDoiUrl(values.doiUrl);
  };

  return (
    <PublicationExpansionPanel
      headerLabel={t('publication_panel.link_to_publication')}
      icon={<LinkIcon className="icon" />}
      id="link-publication-panel"
      expanded={expanded}
      onChange={onChange}
      ariaControls="publication-method-link">
      <StyledBody>
        {t('publication_panel.link_publication_description')}
        <Formik
          onSubmit={values => {
            handleSearch(values);
          }}
          initialValues={{
            doiUrl: '',
          }}
          validationSchema={resourceSchema}>
          {() => (
            <Form>
              <StyledInputBox>
                <StyledTextField
                  aria-label="DOI-link"
                  margin="dense"
                  name="doiUrl"
                  variant="outlined"
                  fullWidth
                  label={t('publication_panel.ORCID-link')}
                  component={TextField}
                />
                <Button color="primary" variant="contained" type="submit">
                  {t('publication_panel.search')}
                </Button>
              </StyledInputBox>
            </Form>
          )}
        </Formik>
        {doiTitle && (
          <>
            <StyledHeading> {t('publication_panel.resource')}:</StyledHeading>
            <StyledTitle>{doiTitle}</StyledTitle>
            <Button fullWidth color="primary" variant="contained" onClick={handleConfirmDOIMetadata}>
              {t('publication_panel.next')}
            </Button>
          </>
        )}
      </StyledBody>
    </PublicationExpansionPanel>
  );
};

export default LinkPublicationPanel;
