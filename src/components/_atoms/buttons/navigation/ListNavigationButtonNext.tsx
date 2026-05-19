import { LinkProps } from 'react-router';
import { NavigationIconButton } from '../../../../pages/tasks/nvi/nvi-candidate-page/_components/NavigationIconButton';
import { dataTestId } from '../../../../utils/dataTestIds';

type ListNavigationButtonNextProps = Pick<LinkProps, 'to' | 'state'> & { title: string };

export const ListNavigationButtonNext = ({ to, state, title }: ListNavigationButtonNextProps) => {
  return (
    <NavigationIconButton
      data-testid={dataTestId.tasksPage.nextItemButton}
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
