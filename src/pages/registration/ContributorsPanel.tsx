import { FormHelperText } from '@mui/material';
import { ErrorMessage, FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useEffect, useRef } from 'react';
import { ContributorRole } from '../../types/contributor.types';
import {
  ArtisticType,
  BookType,
  ContributorFieldNames,
  JournalType,
  ReportType,
} from '../../types/publicationFieldNames';
import { EntityDescription, Registration } from '../../types/registration.types';
import { isDegree, isMediaContribution } from '../../utils/registration-helpers';
import { Contributors } from './contributors_tab/Contributors';

const mediaContributorRoles = [
  ContributorRole.AcademicCoordinator,
  ContributorRole.InterviewSubject,
  ContributorRole.Journalist,
  ContributorRole.ProgrammeLeader,
  ContributorRole.ProgrammeParticipant,
];

export const ContributorsPanel = () => {
  const {
    values: { entityDescription },
    errors,
    touched,
    setFieldValue,
  } = useFormikContext<Registration>();
  const contributorsError = (errors.entityDescription as FormikErrors<EntityDescription>)?.contributors;
  const contributorsTouched = (touched.entityDescription as FormikTouched<EntityDescription>)?.contributors;

  const publicationInstanceType = entityDescription?.reference?.publicationInstance.type ?? '';
  const contributors = entityDescription?.contributors ?? [];
  const contributorsRef = useRef(contributors);

  useEffect(() => {
    // Ensure all contributors has a role by setting Creator role as default
    const contributorsWithRole = contributorsRef.current.map((contributor) => ({
      ...contributor,
      role: contributor.role ?? ContributorRole.Creator,
    }));
    setFieldValue(ContributorFieldNames.Contributors, contributorsWithRole);
  }, [setFieldValue]);

  // Creator should not be selectable for other contributors
  const selectableContributorRoles = Object.values(ContributorRole).filter((role) => role !== ContributorRole.Creator);

  return (
    <>
      <FieldArray name={ContributorFieldNames.Contributors}>
        {({ push, replace }: FieldArrayRenderProps) =>
          isDegree(publicationInstanceType) ? (
            <>
              <Contributors push={push} replace={replace} contributorRoles={[ContributorRole.Creator]} />
              <Contributors
                push={push}
                replace={replace}
                contributorRoles={[ContributorRole.Supervisor]}
                primaryColorAddButton={false}
              />
              <Contributors
                push={push}
                replace={replace}
                contributorRoles={selectableContributorRoles.filter((role) => role !== ContributorRole.Supervisor)}
              />
            </>
          ) : isMediaContribution(publicationInstanceType) ? (
            <Contributors
              push={push}
              replace={replace}
              contributorRoles={mediaContributorRoles}
              primaryColorAddButton
            />
          ) : publicationInstanceType === JournalType.Issue ||
            publicationInstanceType === BookType.Anthology ||
            publicationInstanceType === ReportType.BookOfAbstracts ? (
            <>
              <Contributors push={push} replace={replace} contributorRoles={[ContributorRole.Editor]} />
              <Contributors
                push={push}
                replace={replace}
                contributorRoles={selectableContributorRoles.filter((role) => role !== ContributorRole.Editor)}
              />
            </>
          ) : publicationInstanceType === ArtisticType.ArtisticArchitecture ? (
            <Contributors
              push={push}
              replace={replace}
              contributorRoles={[
                ContributorRole.Architect,
                ContributorRole.LandscapeArchitect,
                ContributorRole.InteriorArchitect,
                ContributorRole.ArchitecturalPlanner,
                ContributorRole.Other,
              ]}
            />
          ) : publicationInstanceType === ArtisticType.ArtisticDesign ? (
            <Contributors
              push={push}
              replace={replace}
              contributorRoles={[
                ContributorRole.Designer,
                ContributorRole.CuratorOrganizer,
                ContributorRole.Consultant,
                ContributorRole.Other,
              ]}
            />
          ) : publicationInstanceType === ArtisticType.PerformingArts ? (
            <Contributors
              push={push}
              replace={replace}
              primaryColorAddButton
              contributorRoles={[
                ContributorRole.Dancer,
                ContributorRole.Actor,
                ContributorRole.Choreographer,
                ContributorRole.Director,
                ContributorRole.Scenographer,
                ContributorRole.CostumeDesigner,
                ContributorRole.Producer,
                ContributorRole.ArtisticDirector,
                ContributorRole.Dramatist,
                ContributorRole.Librettist,
                ContributorRole.Dramaturge,
                ContributorRole.SoundDesigner,
                ContributorRole.LightDesigner,
                ContributorRole.Other,
              ]}
            />
          ) : publicationInstanceType === ArtisticType.MovingPicture ? (
            <Contributors
              push={push}
              replace={replace}
              primaryColorAddButton
              contributorRoles={[
                ContributorRole.Director,
                ContributorRole.Photographer,
                ContributorRole.ProductionDesigner,
                ContributorRole.Screenwriter,
                ContributorRole.SoundDesigner,
                ContributorRole.VfxSupervisor,
                ContributorRole.VideoEditor,
                ContributorRole.Other,
              ]}
            />
          ) : (
            <>
              <Contributors push={push} replace={replace} contributorRoles={[ContributorRole.Creator]} />
              <Contributors push={push} replace={replace} contributorRoles={selectableContributorRoles} />
            </>
          )
        }
      </FieldArray>
      {!!contributorsTouched && typeof contributorsError === 'string' && (
        <FormHelperText error>
          <ErrorMessage name={ContributorFieldNames.Contributors} />
        </FormHelperText>
      )}
    </>
  );
};
