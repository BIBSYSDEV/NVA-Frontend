import { DoiField } from '../../components/DoiField';
import { JournalField } from '../../components/JournalField';
import { PublicationChannelType } from '../../../../../types/registration.types';
import { JournalDetailsFields } from '../../components/JournalDetailsFields';

export const MediaContributionPeriodicalForm = () => (
  <>
    <DoiField />

    <JournalField
      confirmedContextType={PublicationChannelType.MediaContributionPeriodical}
      unconfirmedContextType={PublicationChannelType.UnconfirmedMediaContributionPeriodical}
    />

    <JournalDetailsFields />
  </>
);
