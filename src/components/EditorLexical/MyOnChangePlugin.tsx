import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

interface OnChangeProps {
  onChange: (value: string) => void;
}

export const MyOnChangePlugin = ({ onChange }: OnChangeProps) => {
  const [editor] = useLexicalComposerContext();
  return (
    <OnChangePlugin onChange={(editorState) => editorState.read(() => onChange($generateHtmlFromNodes(editor)))} />
  );
};
