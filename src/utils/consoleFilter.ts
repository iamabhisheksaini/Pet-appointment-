// Console filter to suppress React Navigation deprecation warnings that cause zsh parse errors

const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

const suppressedWarnings = [
  'props.pointerEvents is deprecated',
  'shadow* style props are deprecated',
  'Video element not found for attaching listeners',
  'A listener indicated an asynchronous response by returning true',
  'message channel closed before a response was received',
  'hook.js:', // Chrome extension hooks
  'content.js:', // Chrome extension content scripts
];

export const initializeConsoleFilter = () => {
  // Override console.error to filter out deprecation warnings
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // Check if this is a suppressed warning
    if (suppressedWarnings.some(warning => message.includes(warning))) {
      return; // Don't log suppressed warnings
    }
    
    // Log all other errors normally
    originalConsoleError.apply(console, args);
  };

  // Override console.warn as well
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    
    // Check if this is a suppressed warning
    if (suppressedWarnings.some(warning => message.includes(warning))) {
      return; // Don't log suppressed warnings
    }
    
    // Log all other warnings normally
    originalConsoleWarn.apply(console, args);
  };
};

// Function to restore original console methods if needed
export const restoreConsole = () => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
};
