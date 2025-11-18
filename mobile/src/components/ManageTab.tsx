
import { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@theme/useTheme';

import PromptsManager from './PromptsManager';
import TasksManager from './TasksManager';
import IaEvaluationTab from './IaEvaluationTab';

type ManageTabProps = {
  token?: string | null;
};

function createManageTabStyles(theme: any) {
  return StyleSheet.create({
    manageHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(3),
    },
    manageTitle: {
      fontSize: theme.font.h2,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
    },
    manageTabsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginBottom: theme.spacing(3),
      gap: theme.spacing(2),
    },
    manageTabButton: {
      paddingHorizontal: theme.spacing(3),
      paddingVertical: theme.spacing(1.5),
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.bg,
    },
    manageTabButtonActive: {
      backgroundColor: theme.colors.primarySoft ?? theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    manageTabText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
    },
    manageTabTextActive: {
      color: theme.colors.primaryText ?? '#fff',
    },
  });
}

export default function ManageTab({ token }: ManageTabProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createManageTabStyles(theme), [theme]);
  const [active, setActive] = useState<'prompts' | 'tasks' | 'evaluations'>(
    'prompts',
  );

  return (
    <>
      <View style={styles.manageHeaderRow}>
        <Text style={styles.manageTitle}>
          {t('explore.manage.title') || 'Central de cadastros'}
        </Text>
      </View>

      <View style={styles.manageTabsRow}>
        <Pressable
          style={[
            styles.manageTabButton,
            active === 'prompts' && styles.manageTabButtonActive,
          ]}
          onPress={() => setActive('prompts')}
        >
          <Text
            style={[
              styles.manageTabText,
              active === 'prompts' && styles.manageTabTextActive,
            ]}
          >
            {t('explore.manage.tabs.prompts') || 'Prompts'}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.manageTabButton,
            active === 'tasks' && styles.manageTabButtonActive,
          ]}
          onPress={() => setActive('tasks')}
        >
          <Text
            style={[
              styles.manageTabText,
              active === 'tasks' && styles.manageTabTextActive,
            ]}
          >
            {t('explore.manage.tabs.tasks') || 'Tarefas'}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.manageTabButton,
            active === 'evaluations' && styles.manageTabButtonActive,
          ]}
          onPress={() => setActive('evaluations')}
        >
          <Text
            style={[
              styles.manageTabText,
              active === 'evaluations' && styles.manageTabTextActive,
            ]}
          >
            {t('explore.manage.tabs.evaluations') || 'Avaliar IA'}
          </Text>
        </Pressable>
      </View>

      {active === 'prompts' && <PromptsManager token={token} />}
      {active === 'tasks' && <TasksManager token={token} />}
      {active === 'evaluations' && <IaEvaluationTab token={token} />}
    </>
  );
}
