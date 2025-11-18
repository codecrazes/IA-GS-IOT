
import { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Image,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@theme/useTheme';
import * as Clipboard from 'expo-clipboard';

import searchIcon from '@assets/icons/explore.svg';
import settingsIcon from '@assets/icons/filter.svg';

import { useToast } from '@components/useToast';
import { useIaRankingControl } from '@control/useIARankingControl';

type RankingTabProps = {
  token?: string | null;
};

function createRankingStyles(theme: any) {
  return StyleSheet.create({
    filterBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.bg,
      borderRadius: 999,
      paddingHorizontal: theme.spacing(3),
      paddingVertical: theme.spacing(2),
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 10,
      elevation: 2,
      marginBottom: theme.spacing(4),
      marginTop: theme.spacing(3),
    },
    filterIconLeft: {
      width: 22,
      height: 22,
      marginRight: theme.spacing(2),
      marginLeft: 4,
    },
    filterTexts: {
      flex: 1,
    },
    filterTitle: {
      fontSize: theme.font.base,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
    },
    filterSubtitle: {
      fontSize: theme.font.xs,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
      marginTop: 2,
    },
    filterIconRightWrapper: {
      width: 46,
      height: 46,
      borderRadius: 999,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterIconRight: {
      width: 17,
      height: 17,
      borderRadius: 999,
    },
    listScroll: {
      paddingBottom: theme.spacing(4),
    },
    emptyText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
      textAlign: 'center',
      marginTop: theme.spacing(4),
    },
    modelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing(3),
    },
    modelLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    modelEmojiWrapper: {
      width: 60,
      height: 60,
      borderRadius: 20,
      backgroundColor: theme.colors.bg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing(3),
    },
    modelEmoji: {
      fontSize: 28,
    },
    modelTexts: {
      flex: 1,
    },
    modelTitle: {
      fontSize: theme.font.base,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: 4,
    },
    modelDescription: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
    },
    modelRight: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginLeft: theme.spacing(2),
    },
    modelRank: {
      fontSize: theme.font.base,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing(2),
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
    scoreIcon: {
      width: 16,
      height: 16,
    },
    scoreText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text_alt,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
    },
    modalOverlay: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      width: '88%',
      padding: theme.spacing(4),
      borderRadius: theme.radius.lg,
    },
    modalTitle: {
      fontSize: theme.font.h2,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing(2),
    },
    modalSubtitle: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
      marginBottom: theme.spacing(3),
    },
    modalLabel: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: theme.spacing(1),
    },
    modalInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.sm,
      paddingHorizontal: theme.spacing(3),
      paddingVertical: theme.spacing(2),
      fontSize: theme.font.base,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
      backgroundColor: theme.colors.bg,
      marginBottom: theme.spacing(3),
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
    chip: {
      paddingHorizontal: theme.spacing(3),
      paddingVertical: theme.spacing(1.5),
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    chipActive: {
      backgroundColor: theme.colors.primarySoft ?? theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    chipText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
    },
    chipTextActive: {
      color: theme.colors.primaryText ?? '#fff',
    },
    modalActions: {
      marginTop: theme.spacing(2),
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: theme.spacing(2),
    },
    modalButton: {
      paddingHorizontal: theme.spacing(3),
      paddingVertical: theme.spacing(2),
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    modalButtonPrimary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    modalButtonText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
    },
    modalButtonTextPrimary: {
      color: theme.colors.primaryText ?? '#fff',
    },
    toastContainer: {
      position: 'absolute',
      left: theme.spacing(4),
      right: theme.spacing(4),
      bottom: theme.spacing(6),
      borderRadius: theme.radius.lg,
      paddingHorizontal: theme.spacing(4),
      paddingVertical: theme.spacing(2.5),
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toastText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.primaryText,
      textAlign: 'center',
    },
    toastSuccess: {
      backgroundColor: '#166534',
      borderColor: '#22c55e',
    },
    toastError: {
      backgroundColor: '#991b1b',
      borderColor: '#f97373',
    },
    toastInfo: {
      backgroundColor: '#111827',
      borderColor: '#9ca3af',
    },
    detailHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing(3),
    },
    detailHeaderTexts: {
      flex: 1,
    },
    detailEmojiWrapper: {
      width: 56,
      height: 56,
      borderRadius: 20,
      backgroundColor: theme.colors.bg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing(3),
    },
    detailEmoji: {
      fontSize: 30,
    },
    detailRankText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.subtext,
      marginTop: theme.spacing(1),
    },
    detailScoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
  });
}

export default function RankingTab({ token }: RankingTabProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createRankingStyles(theme), [theme]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('all');
  const [minScore, setMinScore] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const { ranked, loading, error } = useIaRankingControl(token || undefined);
  const { visible, text, type, show, hide } = useToast();

  useEffect(() => {
    if (error) {
      show(
        t('ranking.errors.load') ||
          'Não foi possível carregar o ranking de modelos. Tente novamente.',
        'error',
      );
    }
  }, [error, show, t]);

  const models = ranked || [];

  const filteredModels = useMemo(() => {
    return models
      .filter((m) => {
        const score = typeof m.score0to10 === 'number' ? m.score0to10 : 0;
        const cat = (m.category || m.categoria || 'chat') as string;
        if (category !== 'all' && cat !== category) return false;
        if (minScore != null && score < minScore) return false;
        if (!searchText.trim()) return true;
        const term = searchText.toLowerCase();
        const name = (m.name || '').toLowerCase();
        const desc = (m.description || m.descricao || '').toLowerCase();
        return (
          name.includes(term) ||
          desc.includes(term) ||
          cat.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        if (a.rank && b.rank && a.rank !== b.rank) return a.rank - b.rank;
        const sa = typeof a.score0to10 === 'number' ? a.score0to10 : 0;
        const sb = typeof b.score0to10 === 'number' ? b.score0to10 : 0;
        return sb - sa;
      });
  }, [category, minScore, searchText, models]);

  const resetFilters = () => {
    setSearchText('');
    setCategory('all');
    setMinScore(null);
  };

  const getCategoryLabel = (cat: string) => {
    const fallbackMap: Record<string, string> = {
      chat: 'Chat/Texto',
      code: 'Código',
      image: 'Imagens',
      audio: 'Áudio',
      assistant: 'Assistentes',
    };
    return t(`explore.filter.category.${cat}`) || fallbackMap[cat] || cat;
  };

  const renderToast = () =>
    visible && (
      <Pressable
        onPress={hide}
        style={[
          styles.toastContainer,
          type === 'success' && styles.toastSuccess,
          type === 'error' && styles.toastError,
          type === 'info' && styles.toastInfo,
        ]}
      >
        <Text style={styles.toastText}>{text}</Text>
      </Pressable>
    );

  return (
    <>
      <Pressable style={styles.filterBar} onPress={() => setFilterVisible(true)}>
        <Image source={searchIcon} style={styles.filterIconLeft} resizeMode="contain" />
        <View style={styles.filterTexts}>
          <Text style={styles.filterTitle}>
            {t('explore.filter.title') || 'O que quer fazer?'}
          </Text>
          <Text style={styles.filterSubtitle}>
            {t('explore.filter.subtitle') || 'Vamos escolher o melhor modelo!'}
          </Text>
        </View>
        <View style={styles.filterIconRightWrapper}>
          <Image
            source={settingsIcon}
            style={styles.filterIconRight}
            resizeMode="contain"
          />
        </View>
      </Pressable>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listScroll}
      >
        {loading && (
          <Text style={styles.emptyText}>
            {t('ranking.loading') || 'Carregando modelos...'}
          </Text>
        )}

        {!loading &&
          filteredModels.map((model, index) => {
            const emoji = (model as any).emoji || '🤖';
            const title = model.name || 'Modelo';
            const description = model.description || model.descricao || '';
            const rank = model.rank || index + 1;
            const score =
              typeof model.score0to10 === 'number' ? model.score0to10 : 0;

            return (
              <View key={model.id ?? `${title}-${index}`}>
                <Pressable
                  style={styles.modelRow}
                  onPress={() => setSelectedModel(model)}
                >
                  <View style={styles.modelLeft}>
                    <View style={styles.modelEmojiWrapper}>
                      <Text style={styles.modelEmoji}>{emoji}</Text>
                    </View>
                    <View style={styles.modelTexts}>
                      <Text style={styles.modelTitle}>{title}</Text>
                      <Text style={styles.modelDescription}>{description}</Text>
                    </View>
                  </View>
                  <View style={styles.modelRight}>
                    <Text style={styles.modelRank}>{`#${rank}`}</Text>
                    <View style={styles.scoreChip}>
                      <Text style={styles.scoreIcon}>🌱</Text>
                      <Text style={styles.scoreText}>{score}</Text>
                    </View>
                  </View>
                </Pressable>
                {index < filteredModels.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })}

        {!loading && filteredModels.length === 0 && (
          <Text style={styles.emptyText}>
            {t('explore.filter.empty') ||
              'Nenhum modelo encontrado para estes filtros.'}
          </Text>
        )}
      </ScrollView>

      <Modal
        transparent
        visible={!!selectedModel}
        animationType="fade"
        onRequestClose={() => setSelectedModel(null)}
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
            {selectedModel && (
              <>
                <View style={styles.detailHeaderRow}>
                  <View style={styles.detailEmojiWrapper}>
                    <Text style={styles.detailEmoji}>
                      {(selectedModel as any).emoji || '🤖'}
                    </Text>
                  </View>
                  <View style={styles.detailHeaderTexts}>
                    <Text style={styles.modalTitle}>
                      {selectedModel.name || 'Modelo'}
                    </Text>
                    <Text style={styles.detailRankText}>
                      {t('explore.details.rankLabel', {
                        rank: selectedModel.rank || 1,
                      }) ||
                        `Posição no ranking: #${selectedModel.rank || 1}`}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailScoreRow}>
                  <View style={styles.scoreChip}>
                    <Text style={styles.scoreIcon}>🌱</Text>
                    <Text style={styles.scoreText}>
                      {typeof selectedModel.score0to10 === 'number'
                        ? selectedModel.score0to10
                        : 0}
                    </Text>
                  </View>
                  <Text style={styles.modalSubtitle}>
                    {t('explore.filter.scoreLabel') ||
                      'Pontuação mínima (0 a 5)'}
                  </Text>
                </View>

                <Text style={styles.modalLabel}>
                  {t('explore.details.categoryLabel') || 'Categoria principal'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {getCategoryLabel(
                    selectedModel.category ||
                      selectedModel.categoria ||
                      'chat',
                  )}
                </Text>

                <Text style={styles.modalLabel}>
                  {t('explore.details.descriptionLabel') || 'Descrição'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedModel.description ||
                    selectedModel.descricao ||
                    ''}
                </Text>

                <Text style={styles.modalSubtitle}>
                  {t('explore.details.hint') ||
                    'Use este modelo quando quiser realizar tarefas relacionadas a esse tipo de IA.'}
                </Text>

                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => setSelectedModel(null)}
                  >
                    <Text style={styles.modalButtonText}>
                      {t('common.close') || 'Fechar'}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={filterVisible}
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
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
            <Text style={styles.modalTitle}>
              {t('explore.filter.modalTitle') || 'Filtros do ranking'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {t('explore.filter.modalSubtitle') ||
                'Refine o ranking de acordo com o tipo de tarefa e a nota mínima.'}
            </Text>

            <Text style={styles.modalLabel}>
              {t('explore.filter.searchLabel') || 'Buscar por nome ou tarefa'}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={
                t('explore.filter.searchPlaceholder') ||
                'Ex.: resumo de textos, geração de imagens...'
              }
              placeholderTextColor={theme.colors.subtext}
              value={searchText}
              onChangeText={setSearchText}
            />

            <Text style={styles.modalLabel}>
              {t('explore.filter.categoryLabel') || 'Categoria'}
            </Text>
            <View style={styles.chipRow}>
              {[
                { id: 'all', label: t('explore.filter.category.all') || 'Todas' },
                { id: 'chat', label: t('explore.filter.category.chat') || 'Chat/Texto' },
                { id: 'code', label: t('explore.filter.category.code') || 'Código' },
                { id: 'image', label: t('explore.filter.category.image') || 'Imagens' },
                { id: 'audio', label: t('explore.filter.category.audio') || 'Áudio' },
                {
                  id: 'assistant',
                  label:
                    t('explore.filter.category.assistant') || 'Assistentes',
                },
              ].map((cat) => {
                const selected = category === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextActive,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.modalLabel}>
              {t('explore.filter.scoreLabel') || 'Pontuação mínima (0 a 5)'}
            </Text>
            <View style={styles.chipRow}>
              {[
                {
                  value: null,
                  label: t('explore.filter.score.any') || 'Qualquer',
                },
                { value: 3, label: '≥ 3' },
                { value: 4, label: '≥ 4' },
              ].map((opt) => {
                const selected = minScore === opt.value;
                return (
                  <Pressable
                    key={String(opt.value ?? 'any')}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => setMinScore(opt.value)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.modalButton} onPress={resetFilters}>
                <Text style={styles.modalButtonText}>
                  {t('explore.filter.clear') || 'Limpar'}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => setFilterVisible(false)}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonTextPrimary,
                  ]}
                >
                  {t('explore.filter.apply') || 'Aplicar filtros'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {renderToast()}
    </>
  );
}
