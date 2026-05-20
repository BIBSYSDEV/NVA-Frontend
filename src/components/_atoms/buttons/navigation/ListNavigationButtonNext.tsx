import { LinkProps } from 'react-router';
import { dataTestId as testIds } from '../../../../utils/dataTestIds';
import { NavigationIconButton } from '../NavigationIconButton';

type ListNavigationButtonNextProps = Pick<LinkProps, 'to' | 'state'> & { title: string; dataTestId?: string };

export const ListNavigationButtonNext = ({
  to,
  state,
  title,
  dataTestId = testIds.tasksPage.nextItemButton,
}: ListNavigationButtonNextProps) => {
  return (
    <NavigationIconButton
      data-testid={dataTestId}
      to={to}
      state={state}
      title={title}
      navigateTo={'next'}
      sx={{
        position: 'absolute',
        top: '20rem',
        right: '-1rem',
      }}
    />
  );
};
