import { useEffect } from 'react';
import { stringIncludesMathJax, typesetMathJax } from '../utils/mathJaxHelpers';

interface EmphasizeSubstringProps {
  text: string;
  emphasized: string;
}

export const EmphasizeSubstring = ({ text, emphasized }: EmphasizeSubstringProps) => {
  const indexOfMatch = text.toLocaleLowerCase().indexOf(emphasized.toLocaleLowerCase());
  const lastIndex = indexOfMatch + emphasized.length;
  const textParts =
    indexOfMatch === -1
      ? [text]
      : [text.substring(0, indexOfMatch), text.substring(indexOfMatch, lastIndex), text.substring(lastIndex)];

  useEffect(() => {
    if (stringIncludesMathJax(text)) {
      typesetMathJax();
    }
  }, [text]);

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
