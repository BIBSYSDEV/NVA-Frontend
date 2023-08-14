import { useFormikContext } from 'formik';
import { InputContainerBox } from '../../components/styled/Wrappers';
import { ArtisticType, PublicationType, ResearchDataType } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { getMainRegistrationType, isPeriodicalMediaContribution } from '../../utils/registration-helpers';
import { SelectRegistrationTypeField } from './resource_type_tab/SelectRegistrationTypeField';
import { BookForm } from './resource_type_tab/sub_type_forms/BookForm';
import { ChapterForm } from './resource_type_tab/sub_type_forms/ChapterForm';
import { DegreeForm } from './resource_type_tab/sub_type_forms/DegreeForm';
import { JournalForm } from './resource_type_tab/sub_type_forms/JournalForm';
import { MapForm } from './resource_type_tab/sub_type_forms/MapForm';
import { PresentationForm } from './resource_type_tab/sub_type_forms/PresentationForm';
import { ReportForm } from './resource_type_tab/sub_type_forms/ReportForm';
import { ArtisticArchitectureForm } from './resource_type_tab/sub_type_forms/artistic_types/architecture/ArtisticArchitectureForm';
import { ArtisticDesignForm } from './resource_type_tab/sub_type_forms/artistic_types/design/ArtisticDesignForm';
import { ArtisticLiteraryArtForm } from './resource_type_tab/sub_type_forms/artistic_types/literary_art/ArtisticLiteraryArtForm';
import { ArtisticMovingPictureForm } from './resource_type_tab/sub_type_forms/artistic_types/moving_picture/ArtisticMovingPictureForm';
import { ArtisticMusicPerformanceForm } from './resource_type_tab/sub_type_forms/artistic_types/music_performance/ArtisticMusicPerformanceForm';
import { ArtisticPerformingArtsForm } from './resource_type_tab/sub_type_forms/artistic_types/performing_arts/ArtisticPerformingArtsForm';
import { ArtisticVisualArtForm } from './resource_type_tab/sub_type_forms/artistic_types/visual_arts/ArtisticVisualArtForm';
import { ExhibitionProductionForm } from './resource_type_tab/sub_type_forms/exhibition_types/ExhibitionProductionForm';
import { MediaContributionForm } from './resource_type_tab/sub_type_forms/media_types/MediaContributionForm';
import { MediaContributionPeriodicalForm } from './resource_type_tab/sub_type_forms/media_types/MediaContributionPeriodicalForm';
import { DataManagementPlanForm } from './resource_type_tab/sub_type_forms/research_data_types/DataManagementPlanForm';
import { DatasetForm } from './resource_type_tab/sub_type_forms/research_data_types/DatasetForm';

export const ResourceTypePanel = () => {
  const { values } = useFormikContext<Registration>();
  const instanceType = values.entityDescription?.reference?.publicationInstance?.type ?? '';
  const mainType = getMainRegistrationType(instanceType);

  return (
    <InputContainerBox>
      <SelectRegistrationTypeField />

      {mainType === PublicationType.PublicationInJournal ? (
        <JournalForm />
      ) : mainType === PublicationType.Book ? (
        <BookForm />
      ) : mainType === PublicationType.Report ? (
        <ReportForm />
      ) : mainType === PublicationType.Degree ? (
        <DegreeForm subType={instanceType} />
      ) : mainType === PublicationType.Anthology ? (
        <ChapterForm />
      ) : mainType === PublicationType.Presentation ? (
        <PresentationForm />
      ) : mainType === PublicationType.Artistic ? (
        instanceType === ArtisticType.ArtisticDesign ? (
          <ArtisticDesignForm />
        ) : instanceType === ArtisticType.ArtisticArchitecture ? (
          <ArtisticArchitectureForm />
        ) : instanceType === ArtisticType.PerformingArts ? (
          <ArtisticPerformingArtsForm />
        ) : instanceType === ArtisticType.MovingPicture ? (
          <ArtisticMovingPictureForm />
        ) : instanceType === ArtisticType.MusicPerformance ? (
          <ArtisticMusicPerformanceForm />
        ) : instanceType === ArtisticType.VisualArts ? (
          <ArtisticVisualArtForm />
        ) : instanceType === ArtisticType.LiteraryArts ? (
          <ArtisticLiteraryArtForm />
        ) : null
      ) : mainType === PublicationType.MediaContribution ? (
        isPeriodicalMediaContribution(instanceType) ? (
          <MediaContributionPeriodicalForm />
        ) : (
          <MediaContributionForm />
        )
      ) : mainType === PublicationType.ResearchData ? (
        instanceType === ResearchDataType.DataManagementPlan ? (
          <DataManagementPlanForm />
        ) : instanceType === ResearchDataType.Dataset ? (
          <DatasetForm />
        ) : null
      ) : mainType === PublicationType.ExhibitionContent ? (
        <ExhibitionProductionForm />
      ) : mainType === PublicationType.GeographicalContent ? (
        <MapForm />
      ) : null}
    </InputContainerBox>
  );
};
