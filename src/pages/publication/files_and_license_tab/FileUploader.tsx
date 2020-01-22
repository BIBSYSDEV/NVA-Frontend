import React from 'react';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';

import Tus from '@uppy/tus';
import Uppy from '@uppy/core';
// import AwsS3Multipart from '@uppy/aws-s3-multipart';
import { Dashboard } from '@uppy/react';

const uppy = Uppy({
  autoProceed: true,
  restrictions: {
    allowedFileTypes: ['image/*', 'text/*', 'application/*'],
  },
}).use(Tus, {
  endpoint: 'https://master.tus.io/files/',
});
// .use(AwsS3Multipart, {
// companionUrl: '',
// });

interface FileUploaderProps {
  addFile: (file: any) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ addFile }) => {
  uppy.on('upload-success', uploadedFile => {
    addFile(uploadedFile);
  });

  return (
    <Dashboard
      uppy={uppy}
      showProgressDetails={true}
      proudlyDisplayPoweredByUppy={false}
      showSelectedFiles={false}
      width={10000}
      height={200}
      locale={{
        strings: {
          dropPaste: 'Dra filer hit eller %{browse}',
          browse: 'velg filer',
        },
      }}
    />
  );
};

export default FileUploader;

/* DragDrop + StatusBar:
import '@uppy/drag-drop/dist/style.css';

<DragDrop
  uppy={uppy}
  locale={{
    strings: {
      // Text to show on the droppable area.
      // `%{browse}` is replaced with a link that opens the system file selection dialog.
      dropHereOr: 'Dra filer hit eller %{browse} for å laste opp',
      // Used as the label for the link that opens the system file selection dialog.
      browse: 'trykk',
    },
  }}
/>
<StatusBar uppy={uppy} showProgressDetails={true}></StatusBar>
*/
