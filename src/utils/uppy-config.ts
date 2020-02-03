import { Uppy } from '@uppy/core';
import Tus from '@uppy/tus';

export const createUppy = () =>
  new Uppy({
    autoProceed: true,
  }).use(Tus, {
    endpoint: 'https://master.tus.io/files/',
  });
