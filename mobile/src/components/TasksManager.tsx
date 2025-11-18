
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

import generateIcon from '@assets/icons/generate.svg';
import generateIconDark from '@assets/icons/generate-dark.svg';
import binIcon from '@assets/icons/bin.svg';
import binIconDark from '@assets/icons/bin-dark.svg';
import copyIcon from '@assets/icons/copy.svg';

import { useToast } from '@components/useToast';
import { useTarefasControl } from '@control/useTarefasControl';

type TasksManagerProps = {
  token?: string | null;
};

function createTasksStyles(theme: any) {
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
    manageTabButton: {
      paddingHorizontal: theme.spacing(3),
      paddingVertical: theme.spacing(1.5),
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.bg,
    },
    manageTabText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
    },
    listScroll: {
      paddingBottom: theme.spacing(4),
    },
    searchInput: {
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
    emptyText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
      textAlign: 'center',
      marginTop: theme.spacing(4),
    },
    genericItemRow: {
      paddingVertical: theme.spacing(3),
    },
    genericItemTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
    },
    iaLeft: {
      flex: 1,
    },
    genericItemTitle: {
      fontSize: theme.font.base,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
    },
    genericItemDescription: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
    },
    genericItemActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(2),
    },
    iconButton: {
      width: 32,
      height: 32,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.bg,
    },
    iconImage: {
      width: 18,
      height: 18,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
    },
    formLabel: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    formInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.sm,
      paddingHorizontal: theme.spacing(3),
      paddingVertical: theme.spacing(2),
      fontSize: theme.font.base,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
      backgroundColor: theme.colors.bg,
      marginBottom: theme.spacing(2),
    },
    formTextArea: {
      minHeight: 90,
      textAlignVertical: 'top',
    },
    formActionsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(2),
      gap: theme.spacing(2),
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
    recommendationText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
    },
  });
}

export default function TasksManager({ token }: TasksManagerProps) {
  const { t } = useTranslation();
  const { theme, mode } = useTheme();
  const styles = useMemo(() => createTasksStyles(theme), [theme]);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [search, setSearch] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dificuldade, setDificuldade] = useState('');
  const [tempoDisponivel, setTempoDisponivel] = useState('');
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [recommendationVisible, setRecommendationVisible] = useState(false);
  const [recommendationText, setRecommendationText] = useState('');
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const {
    items,
    loading,
    busy,
    error,
    fieldErrors,
    reload,
    addTarefa,
    gerarRecomendacao,
  } = useTarefasControl(token);
  const { visible, text, type, show, hide } = useToast();
  const isDark = mode === 'dark';
  const generateSource = isDark ? generateIconDark : generateIcon;
  const binSource = isDark ? binIconDark : binIcon;

  useEffect(() => {
    if (error) {
      show(
        t('tarefas.errors.load') ||
          'Não foi possível carregar as tarefas. Tente novamente.',
        'error',
      );
    }
  }, [error, show, t]);

  useEffect(() => {
    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
      const first = Object.values(fieldErrors)[0];
      if (first) show(first, 'error');
    }
  }, [fieldErrors, show]);

  const visibleItems = useMemo(
    () => items.filter((it: any) => !deletedIds.includes(it.id)),
    [items, deletedIds],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return visibleItems;
    return visibleItems.filter(
      (it: any) =>
        (it.titulo || '').toLowerCase().includes(term) ||
        (it.descricao || '').toLowerCase().includes(term),
    );
  }, [visibleItems, search]);

  const truncate = (text: string) => {
    if (!text) return '';
    if (text.length <= 40) return text;
    return `${text.slice(0, 40).trim()}...`;
  };

  const handleCreate = async () => {
    if (!titulo.trim() || !descricao.trim()) {
      show(
        t('tarefas.errors.fieldsRequired') ||
          'Preencha pelo menos título e descrição da tarefa.',
        'error',
      );
      return;
    }
    const body = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      dificuldade: dificuldade.trim() || undefined,
      tempoDisponivel: tempoDisponivel ? Number(tempoDisponivel) : undefined,
      usuarioId: 1,
    };
    const res = await addTarefa(body);
    if (res.ok) {
      setTitulo('');
      setDescricao('');
      setDificuldade('');
      setTempoDisponivel('');
      setViewMode('list');
      show(
        t('tarefas.toasts.created') || 'Tarefa criada com sucesso!',
        'success',
      );
    } else {
      const msg =
        res.erroGeral ||
        error ||
        t('tarefas.errors.create') ||
        'Não foi possível criar a tarefa. Tente novamente.';
      show(msg, 'error');
    }
  };

  const handleGenerate = async (task: any) => {
    const res = await gerarRecomendacao(task.id);
    if (res.ok) {
      const rec = res.data as any;
      const partes: string[] = [];
      if (rec.conteudoGerado) partes.push(rec.conteudoGerado);
      if (rec.insights) partes.push(`Insights: ${rec.insights}`);
      if (rec.passos) partes.push(`Passos:\n${rec.passos}`);
      setRecommendationText(partes.join('\n\n'));
      setRecommendationVisible(true);
      show(
        t('tarefas.toasts.recommendationLoaded') ||
          'Recomendação gerada para esta tarefa.',
        'success',
      );
    } else {
      const msg =
        res.erroGeral ||
        t('tarefas.errors.recommendation') ||
        'Não foi possível gerar a recomendação. Tente novamente.';
      show(msg, 'error');
    }
  };

  const handleConfirmDelete = (item: any) => {
    setItemToDelete(item);
    setDeleteVisible(true);
  };

  const performDelete = () => {
    if (!itemToDelete) {
      setDeleteVisible(false);
      return;
    }
    setDeletedIds((prev) =>
      prev.includes(itemToDelete.id) ? prev : [...prev, itemToDelete.id],
    );
    setItemToDelete(null);
    setDeleteVisible(false);
    show(
      t('tarefas.toasts.deleted') ||
        'Tarefa excluída (apenas na visualização).',
      'info',
    );
  };

  const handleCopyRecommendation = async () => {
    if (!recommendationText) return;
    await Clipboard.setStringAsync(recommendationText);
    show(
      t('tarefas.recommendation.copied') ||
        'Recomendação copiada para a área de transferência.',
      'success',
    );
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
      <View style={styles.manageHeaderRow}>
        <Text style={styles.manageTitle}>
          {viewMode === 'list'
            ? t('tarefas.listTitle') || 'Tarefas'
            : t('tarefas.newTitle') || 'Nova tarefa'}
        </Text>
        <Pressable
          style={styles.manageTabButton}
          onPress={() => setViewMode(viewMode === 'list' ? 'form' : 'list')}
        >
          <Text style={styles.manageTabText}>
            {viewMode === 'list'
              ? t('tarefas.actions.goToForm') || 'Nova tarefa'
              : t('tarefas.actions.goToList') || 'Ver lista'}
          </Text>
        </Pressable>
      </View>

      {viewMode === 'list' ? (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder={
              t('tarefas.searchPlaceholder') ||
              'Buscar por título ou descrição'
            }
            placeholderTextColor={theme.colors.subtext}
            value={search}
            onChangeText={setSearch}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listScroll}
          >
            {loading && (
              <Text style={styles.emptyText}>
                {t('tarefas.loading') || 'Carregando tarefas...'}
              </Text>
            )}

            {!loading &&
              filtered.map((item: any, index: number) => (
                <View key={item.id}>
                  <View style={styles.genericItemRow}>
                    <View style={styles.genericItemTitleRow}>
                      <View style={styles.iaLeft}>
                        <Text style={styles.genericItemTitle}>
                          {item.titulo || ''}
                        </Text>
                        <Text style={styles.genericItemDescription}>
                          {truncate(item.descricao || '')}
                        </Text>
                      </View>
                      <View style={styles.genericItemActions}>
                        <Pressable
                          style={styles.iconButton}
                          onPress={() => handleGenerate(item)}
                          disabled={busy}
                        >
                          <Image
                            source={generateSource}
                            style={styles.iconImage}
                            resizeMode="contain"
                          />
                        </Pressable>
                        <Pressable
                          style={styles.iconButton}
                          onPress={() => handleConfirmDelete(item)}
                          disabled={busy}
                        >
                          <Image
                            source={binSource}
                            style={styles.iconImage}
                            resizeMode="contain"
                          />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                  {index < filtered.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}

            {!loading && filtered.length === 0 && (
              <Text style={styles.emptyText}>
                {t('tarefas.empty') ||
                  'Nenhuma tarefa cadastrada ainda. Crie a primeira na aba de cadastro.'}
              </Text>
            )}
          </ScrollView>
        </>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listScroll}
        >
          <Text style={styles.formLabel}>
            {t('tarefas.fields.titulo') || 'Título da tarefa'}
          </Text>
          <TextInput
            style={styles.formInput}
            placeholder={
              t('tarefas.placeholders.titulo') ||
              'Ex.: Revisar conteúdo de IA para prova'
            }
            placeholderTextColor={theme.colors.subtext}
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={styles.formLabel}>
            {t('tarefas.fields.descricao') || 'Descrição'}
          </Text>
          <TextInput
            style={[styles.formInput, styles.formTextArea]}
            placeholder={
              t('tarefas.placeholders.descricao') ||
              'Descreva o que você precisa estudar ou produzir.'
            }
            placeholderTextColor={theme.colors.subtext}
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          <Text style={styles.formLabel}>
            {t('tarefas.fields.dificuldade') || 'Dificuldade'}
          </Text>
          <TextInput
            style={styles.formInput}
            placeholder={
              t('tarefas.placeholders.dificuldade') ||
              'Ex.: fácil, médio, difícil'
            }
            placeholderTextColor={theme.colors.subtext}
            value={dificuldade}
            onChangeText={setDificuldade}
          />

          <Text style={styles.formLabel}>
            {t('tarefas.fields.tempoDisponivel') ||
              'Tempo disponível (minutos)'}
          </Text>
          <TextInput
            style={styles.formInput}
            placeholder={
              t('tarefas.placeholders.tempoDisponivel') || 'Ex.: 30'
            }
            placeholderTextColor={theme.colors.subtext}
            value={tempoDisponivel}
            onChangeText={setTempoDisponivel}
            keyboardType="numeric"
          />

          <View style={styles.formActionsRow}>
            <Pressable
              onPress={() => {
                setViewMode('list');
                setTitulo('');
                setDescricao('');
                setDificuldade('');
                setTempoDisponivel('');
              }}
              style={styles.modalButton}
              disabled={busy}
            >
              <Text style={styles.modalButtonText}>
                {t('common.cancel') || 'Cancelar'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleCreate}
              style={[styles.modalButton, styles.modalButtonPrimary]}
              disabled={busy}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  styles.modalButtonTextPrimary,
                ]}
              >
                {busy
                  ? t('common.saving') || 'Salvando...'
                  : t('tarefas.actions.save') || 'Salvar tarefa'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      <Modal
        transparent
        visible={deleteVisible}
        animationType="fade"
        onRequestClose={() => setDeleteVisible(false)}
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
              {t('tarefas.confirmDelete.title') || 'Excluir tarefa'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {t('tarefas.confirmDelete.message') ||
                'Tem certeza que deseja excluir esta tarefa?'}
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalButton}
                onPress={() => setDeleteVisible(false)}
                disabled={busy}
              >
                <Text style={styles.modalButtonText}>
                  {t('tarefas.confirmDelete.cancel') || 'Cancelar'}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={performDelete}
                disabled={busy}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonTextPrimary,
                  ]}
                >
                  {t('tarefas.confirmDelete.confirm') || 'Excluir'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={recommendationVisible}
        animationType="fade"
        onRequestClose={() => setRecommendationVisible(false)}
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
              {t('tarefas.recommendation.title') || 'Recomendação de estudo'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {t('tarefas.recommendation.subtitle') ||
                'Use este plano como ponto de partida para organizar seus estudos.'}
            </Text>

            {recommendationText ? (
              <Text style={styles.recommendationText}>
                {recommendationText}
              </Text>
            ) : (
              <Text style={styles.emptyText}>
                {t('tarefas.recommendation.empty') ||
                  'Nenhuma recomendação foi retornada para esta tarefa.'}
              </Text>
            )}

            <View style={styles.modalActions}>
              {recommendationText ? (
                <Pressable
                  style={styles.modalButton}
                  onPress={handleCopyRecommendation}
                >
                  <Image
                    source={copyIcon}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                </Pressable>
              ) : null}
              <Pressable
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => setRecommendationVisible(false)}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonTextPrimary,
                  ]}
                >
                  {t('common.close') || 'Fechar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {fieldErrors && Object.keys(fieldErrors).length > 0 && (
        <Text style={styles.emptyText}>
          {Object.values(fieldErrors).join(' ')}
        </Text>
      )}

      {renderToast()}
    </>
  );
}
