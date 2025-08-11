import React, { useEffect } from 'react';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { ToastContainer } from './src/hooks/use-toast';
import { initializeConsoleFilter } from './src/utils/consoleFilter';

export default function App() {
  useEffect(() => {
    // Initialize console filter to suppress React Navigation deprecation warnings
    // that cause zsh parse errors
    initializeConsoleFilter();
  }, []);

  return( 
  <AppProvider>
      <AppNavigator />
      <ToastContainer />
  </AppProvider>
  )
}
