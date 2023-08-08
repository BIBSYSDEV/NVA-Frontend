import { PublicationChannelType } from '../../../../../types/registration.types';
import { JournalDetailsFields } from '../../components/JournalDetailsFields';
import { JournalField } from '../../components/JournalField';

export const MediaContributionPeriodicalForm = () => (
  <>
    <JournalField
      confirmedContextType={PublicationChannelType.MediaContributionPeriodical}
      unconfirmedContextType={PublicationChannelType.UnconfirmedMediaContributionPeriodical}
    />

    <JournalDetailsFields />
  </>
);
