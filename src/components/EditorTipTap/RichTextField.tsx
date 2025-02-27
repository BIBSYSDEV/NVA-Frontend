import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import React from 'react';
import { Box, Typography } from '@mui/material';
import Placeholder from '@tiptap/extension-placeholder';
import './styles.css';
import { Toolbar } from './Toolbar';

interface RichTextFieldTipTapProps {
  name: string;
  value: string;
  label?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dataTestId?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const RichTextField = ({
  name,
  value,
  label,
  onChange,
  placeholder,
  dataTestId,
  fullWidth,
  disabled,
}: RichTextFieldTipTapProps) => {
  const editor = useEditor({
    extensions: [
      Bold,
      Document,
      History,
      Italic,
      Link.configure({
        openOnClick: false,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
      }),
      Paragraph,
      Placeholder.configure({ placeholder: placeholder }),
      Strike,
      Subscript,
      Superscript,
      Text,
    ],
    content: value,
    editable: !disabled,
  });

  if (!editor) {
    return null;
  }

  return (
    <Box
      sx={{
        width: fullWidth ? '100%' : '',
        padding: '0.5rem',
        bgcolor: 'white',
        borderTopLeftRadius: '4px',
        borderTopRightRadius: '4px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
      }}>
      {label && <Typography sx={{ color: '#0F0035', mb: '0.2rem' }}>{label}</Typography>}
      <Toolbar editor={editor} disabled={disabled} />
      <EditorContent
        data-testid={dataTestId}
        editor={editor}
        id={name}
        onBlur={() => {
          onChange(editor.getHTML());
        }}
      />
    </Box>
  );
};
