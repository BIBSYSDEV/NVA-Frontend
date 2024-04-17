import AccountCircle from '@mui/icons-material/AccountCircleOutlined';
import { Box, Button, IconButton, MenuItem, Menu as MuiMenu, Theme, Typography, useMediaQuery } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getById } from '../../api/commonApi';
import { RootState } from '../../redux/store';
import { Organization } from '../../types/organization.types';
import { dataTestId } from '../../utils/dataTestIds';
import { UrlPathTemplate } from '../../utils/urlPaths';

interface MenuProps {
  handleLogout: () => void;
}

export const Menu = ({ handleLogout }: MenuProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const isExtraSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const name = user?.givenName ?? '';
  const institutionId = user?.topOrgCristinId ?? '';

  const organizationQuery = useQuery({
    enabled: !!institutionId,
    queryKey: [institutionId],
    queryFn: () => getById<Organization>(institutionId),
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  const handleClickMenuAnchor = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  return (
    <Box sx={{ gridArea: 'user-items', display: 'flex' }}>
      {isSmallScreen ? (
        <IconButton onClick={handleClickMenuAnchor} title={t('common.menu')} color="inherit" size="large">
          <AccountCircle fontSize="large" />
        </IconButton>
      ) : (
        <Button
          color="inherit"
          data-testid={dataTestId.header.menuButton}
          onClick={handleClickMenuAnchor}
          startIcon={<AccountCircle />}
          sx={{ textTransform: 'none' }}>
          <Typography noWrap color="inherit">
            {name}
          </Typography>
        </Button>
      )}
      <MuiMenu
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
        {isExtraSmallScreen && user?.isCreator && (
          <MenuItem
            data-testid={dataTestId.header.newRegistrationLink}
            onClick={closeMenu}
            component={Link}
            to={UrlPathTemplate.RegistrationNew}>
            <Typography>{t('registration.new_registration')}</Typography>
          </MenuItem>
        )}
        {isSmallScreen && [
          user?.isCreator && (
            <MenuItem
              key={dataTestId.header.myPageLink}
              data-testid={dataTestId.header.myPageLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.MyPage}>
              <Typography>{t('my_page.my_page')}</Typography>
            </MenuItem>
          ),
          !!user?.customerId && (
            <MenuItem
              key={dataTestId.header.editorLink}
              data-testid={dataTestId.header.editorLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.InstitutionOverviewPage}>
              <Typography>{organizationQuery.data?.acronym}</Typography>
            </MenuItem>
          ),
          (user?.isDoiCurator || user?.isPublishingCurator || user?.isSupportCurator || user?.isNviCurator) && (
            <MenuItem
              key={dataTestId.header.tasksLink}
              data-testid={dataTestId.header.tasksLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.Tasks}>
              <Typography>{t('common.tasks')}</Typography>
            </MenuItem>
          ),
          (user?.isAppAdmin || user?.isInstitutionAdmin) && (
            <MenuItem
              key={dataTestId.header.basicDataLink}
              data-testid={dataTestId.header.basicDataLink}
              onClick={closeMenu}
              component={Link}
              to={UrlPathTemplate.BasicData}>
              <Typography>{t('basic_data.basic_data')}</Typography>
            </MenuItem>
          ),
        ]}
        <MenuItem data-testid={dataTestId.header.logOutLink} onClick={handleLogout}>
          {t('authorization.logout')}
        </MenuItem>
      </MuiMenu>
    </Box>
  );
};
