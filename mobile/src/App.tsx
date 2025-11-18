import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import { ThemeProvider } from '@theme/ThemeContext';
import { AuthProvider } from '@context/AuthContext';
import AppNavigator from '@navigation/index';
import I18nProvider from '@i18n/I18nProvider';
import NotificationsProvider from '@notifications/NotificationsProvider';

SplashScreen.preventAutoHideAsync().catch(() => {});

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <NotificationsProvider>
            <AppNavigator />
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
};

export default App;
