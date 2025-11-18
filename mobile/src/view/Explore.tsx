
import { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@theme/useTheme';

import RankingTab from '@components/RankingTab';
import ManageTab from '@components/ManageTab';

type ExploreProps = {
  token?: string | null;
};

function createExploreStyles(theme: any) {
  return {
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg,
      paddingTop: theme.spacing(4),
    },
    headerTabs: {
      flexDirection: 'row' as const,
      justifyContent: 'center' as const,
      marginBottom: theme.spacing(4),
      gap: theme.spacing(6),
    },
    tabButton: {
      paddingBottom: theme.spacing(1),
    },
    tabText: {
      fontSize: theme.font.h2,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.subtext,
    },
    tabTextActive: {
      color: theme.colors.text,
    },
    tabUnderline: {
      marginTop: theme.spacing(1),
      height: 2,
      borderRadius: 999,
      backgroundColor: theme.colors.text,
    },
    cardWrapper: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      paddingHorizontal: theme.spacing(8),
      paddingVertical: theme.spacing(4),
    },
  };
}

export default function Explore({ token }: ExploreProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createExploreStyles(theme), [theme]);
  const [activeTab, setActiveTab] = useState<'ranking' | 'manage'>('ranking');

  return (
    <SafeAreaView style={styles.root} edges={['bottom', 'left', 'right']}>
      <View style={styles.headerTabs}>
        <Pressable style={styles.tabButton} onPress={() => setActiveTab('ranking')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'ranking' && styles.tabTextActive,
            ]}
          >
            {t('explore.tabs.ranking') || 'Ranking'}
          </Text>
          {activeTab === 'ranking' && <View style={styles.tabUnderline} />}
        </Pressable>

        <Pressable style={styles.tabButton} onPress={() => setActiveTab('manage')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'manage' && styles.tabTextActive,
            ]}
          >
            {t('explore.tabs.manage') || 'Cadastro'}
          </Text>
          {activeTab === 'manage' && <View style={styles.tabUnderline} />}
        </Pressable>
      </View>

      <View style={styles.cardWrapper}>
        {activeTab === 'ranking' ? (
          <RankingTab token={token} />
        ) : (
          <ManageTab token={token} />
        )}
      </View>
    </SafeAreaView>
  );
}
