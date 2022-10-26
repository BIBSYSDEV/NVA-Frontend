// Wait for this to be part of the package (or DefinitelyTyped): https://github.com/uNmAnNeR/imaskjs/pull/446

declare module 'react-imask' {
  import { Component, InputHTMLAttributes, Ref } from 'react';

  export type MaskType = string | typeof RegExp | Date | number;

  /**
   * For more info see the documentation: https://imask.js.org/guide.html#getting-started
   */
  export interface IMaskInputProps extends InputHTMLAttributes<HTMLInputElement> {
    /**
     * See https://imask.js.org/guide.html#masked-pattern
     */
    mask: MaskType;
    value?: string;
    unmask?: 'typed' | boolean;
    prepare?: (value: string, mask: MaskType) => void;
    validate?: (value: string, mask: MaskType) => void;
    commit?: (value: string, mask: MaskType) => void;
    overwrite?: boolean;

    /**
     *  depending on prop above first argument is
     * `value` if `unmask=false`,
     * `unmaskedValue` if `unmask=true`,
     * `typedValue` if `unmask='typed'`
     */
    onAccept?: (value: string, mask: MaskType) => void;
    onComplete?: (value: string, mask: MaskType) => void;

    // pattern
    placeholderChar?: string;
    lazy?: boolean;
    definitions?: any;
    blocks?: any;

    // date
    pattern?: string;
    format?: () => void;
    parse?: () => void;
    autofix?: boolean;

    // number
    radix?: string;
    thousandsSeparator?: string;
    mapToRadix?: string[];
    scale?: number;
    signed?: boolean;
    normalizeZeros?: boolean;
    padFractionalZeros?: boolean;
    min?: number | typeof Date;
    max?: number | typeof Date;

    // dynamic
    dispatch?: () => void;

    /**
     * Input el ref
     */
    inputRef?: Ref<HTMLInputElement> | any;
  }

  export class IMaskInput extends Component<IMaskInputProps> {}
}
