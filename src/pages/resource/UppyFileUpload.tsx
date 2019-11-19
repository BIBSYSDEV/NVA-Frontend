import React, { useEffect } from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import Tus from '@uppy/tus';
import Uppy from '@uppy/core';
// import AwsS3Multipart from '@uppy/aws-s3-multipart';
import { Dashboard } from '@uppy/react';

const uppy = Uppy({
  autoProceed: false,
  restrictions: {
    allowedFileTypes: ['image/*', 'text/*', 'application/*'],
    maxNumberOfFiles: 2,
  },
})
  // .use(AwsS3Multipart, {
  //  Upload potentially big files to aws
  // companionUrl: '',
  // });
  .use(Tus, {
    // Upload files to tus
    endpoint: 'https://master.tus.io/files/',
  });

const UppyFileUpload: React.FC = () => {
  useEffect(() => {
    return () => uppy.close();
  }, []);

  return <Dashboard showProgressDetails={true} proudlyDisplayPoweredByUppy={false} width={1000} uppy={uppy} />;
};

export default UppyFileUpload;
