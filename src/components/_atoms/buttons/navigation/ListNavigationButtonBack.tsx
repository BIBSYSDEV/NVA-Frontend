import { LinkProps } from 'react-router';
import { dataTestId as testIds } from '../../../../utils/dataTestIds';
import { NavigationIconButton } from '../NavigationIconButton';

type ListNavigationButtonBackProps = Pick<LinkProps, 'to' | 'state'> & { title: string; dataTestId?: string };

export const ListNavigationButtonBack = ({
  to,
  state,
  title,
  dataTestId = testIds.tasksPage.previousItemButton,
}: ListNavigationButtonBackProps) => {
  return (
    <NavigationIconButton
      data-testid={dataTestId}
      to={to}
      state={state}
      title={title}
      navigateTo={'previous'}
      sx={{
        position: 'absolute',
        top: '20rem',
        left: '-1rem',
      }}
    />
  );
};
