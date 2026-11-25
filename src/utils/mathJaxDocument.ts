import { AssistiveMmlHandler } from 'mathjax-full/js/a11y/assistive-mml.js';
import { browserAdaptor } from 'mathjax-full/js/adaptors/browserAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import 'mathjax-full/js/input/tex/ams/AmsConfiguration.js';
import 'mathjax-full/js/input/tex/base/BaseConfiguration.js';
import 'mathjax-full/js/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import 'mathjax-full/js/input/tex/cancel/CancelConfiguration.js';
import 'mathjax-full/js/input/tex/color/ColorConfiguration.js';
import 'mathjax-full/js/input/tex/mhchem/MhchemConfiguration.js';
import 'mathjax-full/js/input/tex/noundefined/NoUndefinedConfiguration.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { CHTML } from 'mathjax-full/js/output/chtml.js';
import { SafeHandler } from 'mathjax-full/js/ui/safe/SafeHandler.js';

// NOTE: Only the TeX packages needed for formulas are bundled. Other packages cannot be loaded at runtime.
const texPackages = ['base', 'ams', 'noundefined', 'boldsymbol', 'cancel', 'color', 'mhchem'];

const fontUrl = `https://cdn.jsdelivr.net/npm/mathjax-full@${mathjax.version}/es5/output/chtml/fonts/woff-v2`;

AssistiveMmlHandler(SafeHandler(RegisterHTMLHandler(browserAdaptor())));

const mathDocument = mathjax.document(document, {
  InputJax: new TeX({ packages: texPackages }),
  OutputJax: new CHTML({ fontURL: fontUrl }),
  safeOptions: {
    allow: { URLs: 'none', classes: 'none', cssIDs: 'none', styles: 'none' },
  },
});

/** Typesets the formulas inside the given elements, and nowhere else in the document. */
export const typesetElements = (elements: HTMLElement[]) => {
  mathDocument.options.elements = elements;
  mathDocument.reset();
  mathDocument.render();
};
