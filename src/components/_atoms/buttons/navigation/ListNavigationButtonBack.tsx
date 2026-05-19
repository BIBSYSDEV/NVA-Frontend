import { LinkProps } from 'react-router';
import { NavigationIconButton } from '../../../../pages/tasks/nvi/nvi-candidate-page/_components/NavigationIconButton';
import { dataTestId } from '../../../../utils/dataTestIds';

type ListNavigationButtonBackProps = Pick<LinkProps, 'to' | 'state'> & { title: string };

export const ListNavigationButtonBack = ({ to, state, title }: ListNavigationButtonBackProps) => {
  return (
    <NavigationIconButton
      data-testid={dataTestId.tasksPage.previousItemButton}
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
