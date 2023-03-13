// Handle libraries that rely on window.global, e.g. aws-amplify
(window as any).global ||= window;
export {};
