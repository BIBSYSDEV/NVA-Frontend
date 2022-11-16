import { useFormikContext } from 'formik';
import { MediaRegistration } from '../../../../../types/publication_types/mediaContributionRegistration.types';
import { isPeriodicalMediaContribution } from '../../../../../utils/registration-helpers';
import { MediaContributionForm } from './MediaContributionForm';
import { MediaContributionPeriodicalForm } from './MediaContributionPeriodicalForm';

export const MediaTypeForm = () => {
  const { values } = useFormikContext<MediaRegistration>();
  const subType = values.entityDescription?.reference?.publicationInstance.type;

  return (
    <>
      {subType &&
        (isPeriodicalMediaContribution(subType) ? <MediaContributionPeriodicalForm /> : <MediaContributionForm />)}
    </>
  );
};
