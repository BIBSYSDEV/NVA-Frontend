import type { PaletteColor, PaletteColorOptions } from '@mui/material';

interface TaskTypePalette {
  publishingRequest: PaletteColor;
  filesApprovalThesis: PaletteColor;
  doiRequest: PaletteColor;
  generalSupportCase: PaletteColor;
}

interface TaskTypePaletteOptions {
  publishingRequest?: PaletteColorOptions;
  filesApprovalThesis?: PaletteColorOptions;
  doiRequest?: PaletteColorOptions;
  generalSupportCase?: PaletteColorOptions;
}

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: PaletteColor;
    registration: PaletteColor;
    person: PaletteColor;
    project: PaletteColor;
    centralImport: PaletteColor;
    textPrimary: PaletteColor;
    neutral87: PaletteColor;
    taskType: TaskTypePalette;
  }

  interface PaletteOptions {
    tertiary: PaletteColorOptions;
    registration?: PaletteColorOptions;
    person?: PaletteColorOptions;
    project?: PaletteColorOptions;
    centralImport?: PaletteColorOptions;
    textPrimary?: PaletteColorOptions;
    neutral87?: PaletteColorOptions;
    taskType?: TaskTypePaletteOptions;
  }

  interface TypeBackground {
    neutral97?: string;
    neutral95?: string;
    neutral87?: string;
    neutral46?: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true;
    registration: true;
    person: true;
    project: true;
    white: true;
    neutral87: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    tertiary: true;
  }
}

declare module '@mui/material/PaginationItem' {
  interface PaginationItemPropsColorOverrides {
    tertiary: true;
  }
}
