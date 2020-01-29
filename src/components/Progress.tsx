import React, { FC, useEffect, useState } from 'react';

import { CircularProgress } from '@material-ui/core';

interface ProgressProps {
  size?: number;
}

const Progress: FC<ProgressProps> = ({ size }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tick = () => {
      setProgress(oldProgress => (oldProgress >= 100 ? 0 : oldProgress + 1));
    };

    const timer = setInterval(tick, 20);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <CircularProgress variant="determinate" value={progress} size={size} />;
};

export default Progress;
