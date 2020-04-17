import React, { FC, useEffect, useState } from 'react';

import { CircularProgress, CircularProgressProps } from '@material-ui/core';

const Progress: FC<CircularProgressProps> = ({ size, ...props }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tick = () => {
      setProgress((oldProgress) => (oldProgress + 1) % 100);
    };

    const timer = setInterval(tick, 20);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <CircularProgress size={size} variant="determinate" value={progress} {...props} />;
};

export default Progress;
