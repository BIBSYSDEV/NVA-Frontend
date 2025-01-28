import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import LinkIcon from '@mui/icons-material/Link';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Editor } from '@tiptap/react';
import React, { useCallback } from 'react';
import { isValidUrl } from '../../utils/general-helpers';

interface ToolbarProps {
  editor: Editor;
  disabled?: boolean;
}

export const Toolbar = ({ editor, disabled }: ToolbarProps) => {
  const toggleLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return;
    }

    if (!isValidUrl(url)) {
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: 'blank' }).run();
  }, [editor]);

  const handleButton = (_event: any, value: string) => {
    switch (value[0]) {
      case 'bold': {
        editor.chain().focus().toggleBold().run();
        break;
      }
      case 'italic': {
        editor.chain().focus().toggleItalic().run();
        break;
      }
      case 'underline': {
        editor.chain().focus().toggleUnderline().run();
        break;
      }
      case 'link': {
        toggleLink();
        break;
      }
      case 'undo': {
        editor?.commands.undo();
        break;
      }
      case 'redo': {
        editor?.commands.redo();
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '0.3rem' }}>
      <ToggleButtonGroup size="small" onChange={handleButton} disabled={disabled}>
        <ToggleButton value="undo" disabled={!editor?.can().undo()}>
          <UndoIcon />
        </ToggleButton>
        <ToggleButton value="redo" disabled={!editor?.can().redo()}>
          <RedoIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup size="small" onChange={handleButton} disabled={disabled}>
        <ToggleButton value="bold" selected={editor.isActive('bold')}>
          <FormatBoldIcon />
        </ToggleButton>
        <ToggleButton value="italic" selected={editor.isActive('italic')}>
          <FormatItalicIcon />
        </ToggleButton>
        <ToggleButton value="underline" selected={editor.isActive('underline')}>
          <FormatUnderlinedIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup size="small" onChange={handleButton} disabled={disabled}>
        <ToggleButton value="link" selected={editor.isActive('link')}>
          <LinkIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
