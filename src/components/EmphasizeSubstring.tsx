import React, { FC } from 'react';

interface EmphasizeSubstringProps {
  text: string;
  emphasized: string;
}

const EmphasizeSubstring: FC<EmphasizeSubstringProps> = ({ text, emphasized }) => {
  const indexOfMatch = text.toLocaleLowerCase().indexOf(emphasized.toLocaleLowerCase());
  const textParts =
    indexOfMatch === -1
      ? [text]
      : [
          text.substr(0, indexOfMatch),
          text.substr(indexOfMatch, emphasized.length),
          text.substr(indexOfMatch + emphasized.length),
        ];

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
