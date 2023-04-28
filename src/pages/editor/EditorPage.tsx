import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import GavelIcon from '@mui/icons-material/Gavel';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { VocabularySettings } from './VocabularySettings';
import { PublishStrategySettings } from './PublishStrategySettings';
import { dataTestId } from '../../utils/dataTestIds';
import { EditorRoute } from '../../utils/routes/Routes';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { EditorInstitution } from './EditorInstitution';
import {
  LinkButton,
  NavigationList,
  SidePanel,
  SideNavHeader,
  StyledPageWithSideMenu,
} from '../../components/PageWithSideMenu';
import { RootState } from '../../redux/store';
import { EditorCurators } from './EditorCurators';
import { EditorDoi } from './EditorDoi';

const EditorPage = () => {
  const { t } = useTranslation();
  const { customer } = useSelector((store: RootState) => store);
  const history = useHistory();
  const currentPath = history.location.pathname.replace(/\/$/, ''); // Remove trailing slash

  useEffect(() => {
    if (currentPath === UrlPathTemplate.Editor) {
      history.replace(UrlPathTemplate.EditorInstitution);
    }
  }, [history, currentPath]);

  return (
    <StyledPageWithSideMenu>
      <SidePanel aria-labelledby="editor-title">
        <SideNavHeader text={customer?.shortName} id="editor-title" icon={StoreIcon} />
        <Accordion
          elevation={0}
          expanded={currentPath === UrlPathTemplate.EditorCurators}
          sx={{
            borderTop: '1px solid',
            ':last-child': {
              borderBottom: '1px solid',
            },
            '&.MuiAccordion-root.Mui-expanded': {
              margin: 0,
            },
            bgcolor: 'secondary.main',
          }}>
          <AccordionSummary
            sx={{
              paddingRight: '0.2',
              '&.MuiAccordionSummary-root.Mui-expanded': {
                minHeight: 0,
                height: '50px',
              },
            }}
            onClick={() =>
              !currentPath.startsWith(UrlPathTemplate.EditorOverview) && history.push(UrlPathTemplate.EditorCurators)
            }
            expandIcon={<ExpandMoreIcon color="primary" />}>
            <Box
              sx={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
              }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'white',
                  borderRadius: '50%',
                  width: '1.6rem',
                  height: '1.6rem',
                }}>
                <ArchitectureIcon fontSize="small" />
              </Box>
              <Typography variant="h3" fontWeight={500} textTransform="uppercase">
                {t('common.overview')}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: 0, margin: 0 }}>
            <NavigationList>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.EditorCurators}
                data-testid={dataTestId.editor.areaOfResponsibilityLinkButton}
                to={UrlPathTemplate.EditorCurators}>
                {t('editor.curators.areas_of_responsibility')}
              </LinkButton>
            </NavigationList>
          </AccordionDetails>
        </Accordion>
        <Accordion
          elevation={0}
          expanded={
            currentPath === UrlPathTemplate.EditorInstitution ||
            currentPath === UrlPathTemplate.EditorDoi ||
            currentPath === UrlPathTemplate.EditorPublishStrategy ||
            currentPath === UrlPathTemplate.EditorVocabulary
          }
          sx={{
            borderTop: '1px solid',
            ':last-child': {
              borderBottom: '1px solid',
            },
            '&.MuiAccordion-root.Mui-expanded': {
              margin: 0,
            },
            bgcolor: 'secondary.main',
          }}>
          <AccordionSummary
            onClick={() =>
              !currentPath.startsWith(UrlPathTemplate.EditorSettings) && history.push(UrlPathTemplate.EditorInstitution)
            }
            expandIcon={<ExpandMoreIcon color="primary" />}
            sx={{
              padding: '0.2',
              '&.MuiAccordionSummary-root.Mui-expanded': {
                minHeight: 0,
                height: '50px',
              },
            }}>
            <Box
              sx={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
              }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'white',
                  borderRadius: '50%',
                  width: '1.6rem',
                  height: '1.6rem',
                }}>
                <GavelIcon fontSize="small" />
              </Box>
              <Typography variant="h3" fontWeight={500} textTransform="uppercase">
                {t('common.settings')}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingX: 0 }}>
            <NavigationList>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.EditorInstitution}
                data-testid={dataTestId.editor.institutionsNameLinkButton}
                to={UrlPathTemplate.EditorInstitution}>
                {t('editor.institution.institution_name')}
              </LinkButton>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.EditorDoi}
                data-testid={dataTestId.editor.doiLinkButton}
                to={UrlPathTemplate.EditorDoi}>
                {t('common.doi_long')}
              </LinkButton>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.EditorVocabulary}
                data-testid={dataTestId.editor.vocabularyLinkButton}
                to={UrlPathTemplate.EditorVocabulary}>
                {t('editor.vocabulary')}
              </LinkButton>
              <LinkButton
                isSelected={currentPath === UrlPathTemplate.EditorPublishStrategy}
                data-testid={dataTestId.editor.publishStrategyLinkButton}
                to={UrlPathTemplate.EditorPublishStrategy}>
                {t('editor.publish_strategy.publish_strategy')}
              </LinkButton>
            </NavigationList>
          </AccordionDetails>
        </Accordion>
      </SidePanel>
      <BackgroundDiv>
        <Switch>
          <EditorRoute exact path={UrlPathTemplate.EditorVocabulary} component={VocabularySettings} />
          <EditorRoute exact path={UrlPathTemplate.EditorPublishStrategy} component={PublishStrategySettings} />
          <EditorRoute exact path={UrlPathTemplate.EditorInstitution} component={EditorInstitution} />
          <EditorRoute exact path={UrlPathTemplate.EditorCurators} component={EditorCurators} />
          <EditorRoute exact path={UrlPathTemplate.EditorDoi} component={EditorDoi} />
        </Switch>
      </BackgroundDiv>
    </StyledPageWithSideMenu>
  );
};

export default EditorPage;
