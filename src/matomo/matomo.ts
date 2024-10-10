declare global {
  interface Window {
    _mtm?: Array<Record<string, unknown>>;
  }
}

export const initializeMatomo = (matomoContainerUrl: string) => {
  const _mtm = (window._mtm = window._mtm || []);
  _mtm.push({
    'mtm.startTime': new Date().getTime(),
    event: 'mtm.Start',
  });

  const documentRef = document;
  const newScriptElement = documentRef.createElement('script');
  const firstScriptElement = documentRef.getElementsByTagName('script')[0];

  newScriptElement.async = true;
  newScriptElement.src = matomoContainerUrl;
  firstScriptElement.parentNode?.insertBefore(newScriptElement, firstScriptElement);

  // Log global JavaScript errors
  window.onerror = function (message, source, lineno, colno, error) {
    _mtm.push({
      event: 'JavaScript Error',
      errorMessage: message,
      errorSource: `${source}:${lineno}:${colno}`,
      errorStack: error ? error.stack : '',
    });
  };

  // Log console errors
  /* eslint-disable no-console */
  const originalConsoleError = console.error;
  console.error = function (message, ...optionalParams) {
    _mtm.push({
      event: 'trackJsError',
      error: message,
      optionalParams: optionalParams,
    });
    originalConsoleError.apply(console, [message, ...optionalParams]); // Ensure error is still shown in console
  };
};
