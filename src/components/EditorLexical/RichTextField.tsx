import { LinkNode } from '@lexical/link';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { Box, Typography } from '@mui/material';
import React from 'react';
import { isValidUrl } from '../../utils/general-helpers';
import { MyOnChangePlugin } from './MyOnChangePlugin';
import { StyledContentEditable, StyledContentEditableContainer, StyledEditor, StyledPlaceholder } from './styles';
import { theme } from './theme';
import { Toolbar } from './Toolbar';

interface RichTextFieldLexicalProps {
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
  // value, // TODO
  label,
  onChange,
  placeholder,
  dataTestId,
  fullWidth,
  disabled,
}: RichTextFieldLexicalProps) => {
  const initialConfig = {
    namespace: name,
    theme,
    onError(error: Error) {
      throw error;
    },
    // editorState: value, // TODO: Finne ut hvordan convertere html til editorState uten editorContext
    nodes: [LinkNode],
    editable: !disabled,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Box sx={{ width: fullWidth ? '100%' : '' }}>
        <StyledEditor>
          {label && <Typography sx={{ color: '#0F0035', mb: '0.2rem' }}>{label}</Typography>}
          <Toolbar disabled={disabled} />
          <StyledContentEditableContainer>
            <RichTextPlugin
              contentEditable={
                <StyledContentEditable
                  data-testid={dataTestId}
                  aria-placeholder={placeholder ?? ''}
                  placeholder={<StyledPlaceholder>{placeholder ?? ''}</StyledPlaceholder>}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <LinkPlugin validateUrl={(url) => !!isValidUrl(url)} />
            <MyOnChangePlugin onChange={onChange} />
          </StyledContentEditableContainer>
        </StyledEditor>
      </Box>
    </LexicalComposer>
  );
};
