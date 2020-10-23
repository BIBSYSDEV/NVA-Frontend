import React, { FC } from 'react';
import { getTextParts } from '../pages/registration/description_tab/projects_field';

interface EmphasizeSubstringProps {
  text: string;
  emphasized: string;
}

const EmphasizeSubstring: FC<EmphasizeSubstringProps> = ({ text, emphasized }) => {
  const textParts = getTextParts(text, emphasized);

  return (
    <>
      {textParts.map((part, index) => (
        <span
          key={index}
          style={{
            fontWeight: part.toLocaleLowerCase() === emphasized.toLocaleLowerCase() ? 700 : 400,
          }}>
          {part}
        </span>
      ))}
    </>
  );
};

export default EmphasizeSubstring;
