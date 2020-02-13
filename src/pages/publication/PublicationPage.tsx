import React, { FC, useEffect, useState } from 'react';
import { getPublication } from '../../api/publicationApi';
import { addNotification } from '../../redux/actions/notificationActions';
import i18n from '../../translations/i18n';
import { useDispatch } from 'react-redux';
import { CircularProgress, Typography } from '@material-ui/core';
import { emptyPublication, Publication } from '../../types/publication.types';
import styled from 'styled-components';
import ContentPage from '../../components/FormCard/ContentPage';

const StyledContentPage = styled(ContentPage)`
  align-self: flex-start;
  border: 1px solid red;
`;

const AuthorsWrapper = styled.div`
  background-color: pink;
`;

const Sidebar = styled.div`
  background-color: pink;
`;

const IntitutionWrapper = styled.div`
  background-color: pink;
`;

const FilesWrapper = styled.div`
  background-color: pink;
`;

const MainContent = styled.div`
  background-color: pink;
`;
const LinkWrapper = styled.div`
  background-color: pink;
`;

const DescriptionWrapper = styled.div`
  background-color: pink;
`;

const Header = styled(Typography)`
  color: grey;
`;

interface PublicationPageProps {
  publicationId: string;
}

const PublicationPage: FC<PublicationPageProps> = ({ publicationId }) => {
  const dispatch = useDispatch();
  const [isLoadingPublication, setIsLoadingPublication] = useState(false);
  const [publication, setPublication] = useState<Publication>(emptyPublication);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingPublication(true);
      const publication = await getPublication(publicationId);
      if (publication?.error) {
        dispatch(addNotification(i18n.t('feedback:error.get_publication'), 'error'));
      } else {
        console.log(publication);
        setPublication(publication);
      }
      setIsLoadingPublication(false);
    };
    loadData();
  }, [dispatch, publicationId]);

  return (
    <>
      {isLoadingPublication ? (
        <CircularProgress color="inherit" size={20} />
      ) : (
        <StyledContentPage>
          <Header>{publication.title?.no}</Header>
          <AuthorsWrapper>{publication.authors?.[0]?.name}</AuthorsWrapper>
          <Sidebar>
            <IntitutionWrapper>
              1. NTNU institutt for osteloff
              <br />
              2.SINTEF Teknologi og samfunn
            </IntitutionWrapper>
            <FilesWrapper>
              <img src={'test.jpg'} />
            </FilesWrapper>
          </Sidebar>
          <MainContent>
            <LinkWrapper>Lenke: {publication.doiLink}</LinkWrapper>
            <DescriptionWrapper>{publication.doiLink}</DescriptionWrapper>
          </MainContent>
        </StyledContentPage>
      )}
    </>
  );
};

export default PublicationPage;
