import { $toggleLink, $isLinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import LinkIcon from '@mui/icons-material/Link';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  createCommand,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  TextFormatType,
  UNDO_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ToolbarProps {
  disabled?: boolean;
}

const LowPriority = 1;
const TOGGLE_LINK_URL_COMMAND = createCommand('TOGGLE_LINK_URL_COMMAND');

export const Toolbar = ({ disabled }: ToolbarProps) => {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isLink, setIsLink] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsLink(selection.getNodes().some((node) => $isLinkNode(node.getParent())));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        TOGGLE_LINK_URL_COMMAND,
        () => {
          editor.update(() => {
            const url = window.prompt('URL');
            if (url === '') {
              $toggleLink(null);
            } else {
              $toggleLink(url);
            }
          });
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const handleFormat = (_event: any, format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  return (
    <Box sx={{ display: 'flex', gap: '0.3rem' }} ref={toolbarRef}>
      <ToggleButtonGroup size="small" disabled={disabled}>
        <ToggleButton
          value={UNDO_COMMAND}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          disabled={!canUndo}
          aria-label="Undo">
          <UndoIcon />
        </ToggleButton>
        <ToggleButton
          value={REDO_COMMAND}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          disabled={!canRedo}
          aria-label="Redo">
          <RedoIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup size="small" onChange={handleFormat} disabled={disabled}>
        <ToggleButton size="small" value="bold" aria-label="Format Bold" selected={isBold}>
          <FormatBoldIcon />
        </ToggleButton>
        <ToggleButton value="italic" aria-label="Format Italics" selected={isItalic}>
          <FormatItalicIcon />
        </ToggleButton>
        <ToggleButton value="underline" aria-label="Format Underline" selected={isUnderline}>
          <FormatUnderlinedIcon />
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup size="small" disabled={disabled}>
        <ToggleButton
          value={TOGGLE_LINK_URL_COMMAND}
          aria-label="Format Link"
          selected={isLink}
          onClick={() => {
            editor.dispatchCommand(TOGGLE_LINK_URL_COMMAND, undefined);
          }}>
          <LinkIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
