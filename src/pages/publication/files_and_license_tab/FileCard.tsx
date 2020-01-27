import React from 'react';

interface FileCardProps {
  file: any;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  return <p>{file.name}</p>;
};

export default FileCard;
