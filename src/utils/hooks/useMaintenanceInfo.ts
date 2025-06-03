export const useMaintenanceInfo = () => {
  const nbHeading = import.meta.env.VITE_STATUS_HEADING_NB as string | undefined;
  const nbDescription = import.meta.env.VITE_STATUS_DESCRIPTION_NB as string | undefined;

  if (!nbHeading || !nbDescription) {
    return null;
  }

  const startDate = import.meta.env.VITE_STATUS_START as string | undefined;
  if (startDate) {
    const currentDate = new Date();
    if (new Date(startDate) > currentDate) {
      return null;
    }
  }

  const endDate = import.meta.env.VITE_STATUS_END as string | undefined;
  if (endDate) {
    const currentDate = new Date();
    if (new Date(endDate) < currentDate) {
      return null;
    }
  }

  return {
    heading: {
      nb: nbHeading,
      en: import.meta.env.VITE_STATUS_HEADING_EN as string | undefined,
    },
    description: {
      nb: nbDescription,
      en: import.meta.env.VITE_STATUS_DESCRIPTION_EN as string | undefined,
    },
    startDate,
    endDate,
  };
};
