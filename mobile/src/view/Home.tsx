import React, { useMemo, useEffect, useState, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { useTheme } from '@theme/useTheme';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '@context/AuthContext';
import { getProfileService } from '@service/userService';
import { useIaRankingControl } from '@control/useIARankingControl';
import { IaRankingViewItem } from '@model/ia';

const CARD_COLORS = ['#F4E9A9', '#FFE39A', '#D9F1A8', '#FFC273', '#F2C7A2', '#F2E7A7'];

const createStyles = (theme: any, padBottom: number) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing(4),
      paddingTop: theme.spacing(4),
      paddingBottom: padBottom + theme.spacing(4),
    },
    headerSpace: {
      marginLeft: theme.spacing(2),
      marginTop: theme.spacing(1),
    },
    greetingTitle: {
      fontSize: 28,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
    },
    greetingSubtitle: {
      marginTop: theme.spacing(1),
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
    },
    exploreButton: {
      marginTop: theme.spacing(5),
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing(3),
      alignItems: 'center',
      justifyContent: 'center',
      width: 184,
      height: 62,
      alignSelf: 'flex-start',
    },
    exploreText: {
      fontSize: theme.font.xs,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.primaryText,
    },
    cardsGrid: {
      marginTop: theme.spacing(5),
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 15,
    },
    card: {
      width: 184,
      height: 176,
      borderRadius: 31,
      paddingHorizontal: theme.spacing(4),
      paddingVertical: theme.spacing(4),
    },
    cardEmojiWrapper: {
      width: 52,
      height: 52,
      borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing(2),
    },
    cardEmoji: {
      fontSize: 28,
    },
    cardTitle: {
      fontSize: theme.font.lg,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text_alt,
    },
    cardDescription: {
      fontSize: theme.font.xs,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext_alt,
    },
    modalOverlay: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      width: '86%',
      borderRadius: theme.radius.lg,
      padding: theme.spacing(4),
    },
    modalEmojiWrapper: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing(3),
    },
    modalEmoji: {
      fontSize: 30,
    },
    modalTitle: {
      fontSize: theme.font.h2,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing(2),
    },
    modalDetailText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
      marginBottom: theme.spacing(4),
    },
    modalCloseButton: {
      alignSelf: 'flex-end',
      paddingVertical: theme.spacing(1),
      paddingHorizontal: theme.spacing(2),
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    modalCloseText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
    },
    modalScoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing(2),
      gap: theme.spacing(2),
    },
    scoreChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#D9F1A8',
      borderRadius: 999,
      paddingHorizontal: theme.spacing(2),
      paddingVertical: theme.spacing(1),
      gap: theme.spacing(1),
    },
    scoreText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
    },
    modalLabel: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing(1),
    },
    modalSubtitle: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
      marginBottom: theme.spacing(2),
    },
  });

function getShortDescription(text: string, maxLength = 80): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { token, email: sessionEmail } = useContext(AuthContext);
  const { ranked } = useIaRankingControl(token);
  const padBottom = 16;
  const styles = useMemo(() => createStyles(theme, padBottom), [theme, padBottom]);

  const [nome, setNome] = useState<string | null>(null);
  const [selectedIa, setSelectedIa] = useState<IaRankingViewItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    const carregarNome = async () => {
      if (!token) return;
      const res = await getProfileService(token);
      if (!isMounted) return;
      if (res.ok) {
        setNome(res.nome || null);
      }
    };
    carregarNome();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const userName =
    (nome && nome.trim().split(' ')[0]) ||
    (sessionEmail && sessionEmail.split('@')[0]) ||
    t('home.defaultName') ||
    'Estudante';

  const topIas = ranked.slice(0, 6);

  return (
    <SafeAreaView style={styles.root} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSpace}>
          <Text style={styles.greetingTitle}>
            {t('home.greeting', { name: userName }) || `Olá, ${userName}!`}
          </Text>
          <Text style={styles.greetingSubtitle}>
            {t('home.greetingSubtitle') || 'O que vamos aprender hoje?'}
          </Text>

          <Pressable
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Explore')}
          >
            <Text style={styles.exploreText}>
              {t('home.exploreButton') || 'Explorar'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.cardsGrid}>
          {topIas.map((ia, index) => {
            const shortDesc = getShortDescription(ia.description || '', 30);
            const bgColor = CARD_COLORS[index % CARD_COLORS.length];
            return (
              <Pressable
                key={ia.id}
                style={[styles.card, { backgroundColor: bgColor }]}
                onPress={() => setSelectedIa(ia)}
              >
                <View style={styles.cardEmojiWrapper}>
                  <Text style={styles.cardEmoji}>{ia.emoji}</Text>
                </View>
                <Text style={styles.cardTitle}>{ia.name}</Text>
                <Text style={styles.cardDescription}>{shortDesc}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={!!selectedIa}
        animationType="fade"
        onRequestClose={() => setSelectedIa(null)}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: theme.colors.overlay },
          ]}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.card },
            ]}
          >
            {selectedIa && (
              <>
                <View style={styles.modalEmojiWrapper}>
                  <Text style={styles.modalEmoji}>{selectedIa.emoji}</Text>
                </View>

                <Text style={styles.modalTitle}>{selectedIa.name}</Text>

                <View style={styles.modalScoreRow}>
                  <View style={styles.scoreChip}>
                    <Text>🌱</Text>
                    <Text style={styles.scoreText}>{selectedIa.score0to10}</Text>
                  </View>
                  <Text style={styles.modalSubtitle}>
                    {t('explore.filter.scoreLabel') ||
                      'Nota mínima (sustentabilidade)'}
                  </Text>
                </View>

                <Text style={styles.modalLabel}>
                  {t('explore.details.categoryLabel') || 'Categoria principal'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedIa.rawType || selectedIa.category}
                </Text>

                <Text style={styles.modalLabel}>
                  {t('explore.details.descriptionLabel') || 'Descrição'}
                </Text>
                <Text style={styles.modalDetailText}>
                  {selectedIa.description}
                </Text>

                <Pressable
                  style={styles.modalCloseButton}
                  onPress={() => setSelectedIa(null)}
                >
                  <Text style={styles.modalCloseText}>
                    {t('home.close') || 'Fechar'}
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
