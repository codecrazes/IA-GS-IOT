import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@theme/useTheme';

function getVersionLabel() {
  const nativeVersion = Application.nativeApplicationVersion ?? '0.0.0';
  const nativeBuild = Application.nativeBuildVersion ?? '-';
  const expoVersion = Constants?.expoConfig?.version ?? '0.0.0';
  const runtime = __DEV__ ? 'development' : 'production';
  return { nativeVersion, nativeBuild, expoVersion, runtime };
}

const createStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg,
      paddingHorizontal: theme.spacing(4),
      paddingTop: theme.spacing(4),
    },
    card: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: 25,
      paddingHorizontal: theme.spacing(4),
      paddingVertical: theme.spacing(4),
      maxHeight: '95%',
    },
    title: {
      fontSize: theme.font.h1,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing(6),
    },
    row: {
      marginBottom: theme.spacing(4),
    },
    label: {
      fontSize: theme.font.lg,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing(1),
    },
    value: {
      fontSize: theme.font.base,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
      marginTop: theme.spacing(3),
    },
  });

export default function About() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { nativeVersion, nativeBuild, expoVersion, runtime } = getVersionLabel();

  const appName =
    Constants?.expoConfig?.name ||
    Constants?.manifest2?.extra?.expoClient?.name ||
    'MotoHub';

  const gitSha =
    process.env.EXPO_PUBLIC_GIT_SHA ||
    Constants?.expoConfig?.extra?.EXPO_PUBLIC_GIT_SHA ||
    'unknown';

  const pushEnv =
    process.env.EXPO_PUBLIC_PUSH_ENV ||
    Constants?.expoConfig?.extra?.EXPO_PUBLIC_PUSH_ENV ||
    runtime;

  return (
    <SafeAreaView style={styles.root} edges={['bottom', 'left', 'right']}>
      <View style={styles.card}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: theme.spacing(2) }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{t('about.title') || 'Sobre o App'}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>{t('about.appName') || 'Nome do Aplicativo:'}</Text>
            <Text style={styles.value}>{appName}</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t('about.nativeVersion') || 'Versão Nativa:'}</Text>
            <Text style={styles.value}>{nativeVersion}</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t('about.expoVersion') || 'Versão do Expo:'}</Text>
            <Text style={styles.value}>{expoVersion}</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t('about.buildNumber') || 'Número do Build:'}</Text>
            <Text style={styles.value}>{nativeBuild}</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t('about.runtime') || 'Ambiente:'}</Text>
            <Text style={styles.value}>{pushEnv}</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t('about.gitSha') || 'Commit:'}</Text>
            <Text style={styles.value}>{gitSha}</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
