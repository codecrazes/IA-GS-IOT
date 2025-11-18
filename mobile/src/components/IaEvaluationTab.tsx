
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

import writeIcon from '@assets/icons/edit.svg';
import writeIconDark from '@assets/icons/edit-dark.svg';

import { useToast } from '@components/useToast';
import { useIaRankingControl } from '@control/useIARankingControl';
import { useAvaliacoesControl } from '@control/useAvaliacoesControl';

type IaEvaluationTabProps = {
  token?: string | null;
};

function createIaEvaluationStyles(theme: any) {
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
    iaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing(3),
    },
    iaLeft: {
      flex: 1,
    },
    iaName: {
      fontSize: theme.font.base,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: 4,
    },
    iaDescription: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
    },
    iaRight: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      marginLeft: theme.spacing(2),
      gap: theme.spacing(1),
    },
    iaAverage: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
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
    formTextArea: {
      minHeight: 90,
      textAlignVertical: 'top',
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
  });
}

export default function IaEvaluationTab({ token }: IaEvaluationTabProps) {
  const { t } = useTranslation();
  const { theme, mode } = useTheme();
  const styles = useMemo(() => createIaEvaluationStyles(theme), [theme]);
  const {
    items: iaItems,
    loading,
    error: iaError,
    reload,
  } = useIaRankingControl(token || undefined);
  const {
    addAvaliacao,
    busy,
    error: avaliacaoError,
    fieldErrors,
  } = useAvaliacoesControl(token || undefined);
  const [selectedIa, setSelectedIa] = useState<any | null>(null);
  const [scoreText, setScoreText] = useState('');
  const [comment, setComment] = useState('');
  const [errorField, setErrorField] = useState('');
  const { visible, text, type, show, hide } = useToast();
  const isDark = mode === 'dark';
  const writeSource = isDark ? writeIconDark : writeIcon;

  useEffect(() => {
    if (iaError) {
      show(
        t('avaliacoes.errors.load') ||
          'Não foi possível carregar as IAs. Tente novamente.',
        'error',
      );
    }
  }, [iaError, show, t]);

  useEffect(() => {
    if (avaliacaoError) {
      show(
        avaliacaoError ||
          t('avaliacoes.errors.create') ||
          'Não foi possível salvar sua avaliação. Tente novamente.',
        'error',
      );
    }
  }, [avaliacaoError, show, t]);

  const averageFromIa = (ia: any) => {
    if (typeof ia.score0to10 === 'number') return ia.score0to10;
    if (typeof ia.averageScore === 'number') return ia.averageScore;
    return null;
  };

  const handleOpenModal = (ia: any) => {
    setSelectedIa(ia);
    setScoreText('');
    setComment('');
    setErrorField('');
  };

  const handleSave = async () => {
    if (!selectedIa) return;
    const value = Number(scoreText.replace(',', '.'));
    if (Number.isNaN(value)) {
      setErrorField(
        t('avaliacoes.errors.notaRequired') ||
          'Informe uma nota entre 0 e 10.',
      );
      return;
    }
    if (value < 0 || value > 10) {
      setErrorField(
        t('avaliacoes.errors.notaRange') ||
          'A nota deve estar entre 0 e 10.',
      );
      return;
    }
    const res = await addAvaliacao({
      nota: value,
      comentario: comment.trim() || null,
      iaId: selectedIa.id,
    });
    if (res.ok) {
      show(
        t('avaliacoes.toasts.saved') ||
          'Avaliação registrada com sucesso!',
        'success',
      );
      reload();
      setSelectedIa(null);
      setScoreText('');
      setComment('');
      setErrorField('');
    } else {
      const msg =
        res.erroGeral ||
        t('avaliacoes.errors.create') ||
        'Não foi possível salvar sua avaliação. Tente novamente.';
      show(msg, 'error');
      if (res.fieldErrors && res.fieldErrors.nota) {
        setErrorField(res.fieldErrors.nota);
      }
    }
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
          {t('avaliacoes.sectionTitle') || 'Avaliar IA'}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listScroll}
      >
        {loading && (
          <Text style={styles.emptyText}>
            {t('avaliacoes.loading') || 'Carregando IAs...'}
          </Text>
        )}
        {!loading &&
          iaItems.map((ia: any, index: number) => {
            const avg = averageFromIa(ia);
            return (
              <View key={ia.id ?? `ia-${index}`}>
                <View style={styles.iaRow}>
                  <View style={styles.iaLeft}>
                    <Text style={styles.iaName}>
                      {ia.name || ia.nome || ''}
                    </Text>
                    <Text style={styles.iaDescription}>
                      {ia.description || ia.descricao || ''}
                    </Text>
                  </View>
                  <View style={styles.iaRight}>
                    {avg != null && (
                      <Text style={styles.iaAverage}>
                        {t('avaliacoes.averageLabel', {
                          value: avg.toFixed(1),
                        }) || `Média: ${avg.toFixed(1)}`}
                      </Text>
                    )}
                    <Pressable
                      style={styles.iconButton}
                      onPress={() => handleOpenModal(ia)}
                    >
                      <Image
                        source={writeSource}
                        style={styles.iconImage}
                        resizeMode="contain"
                      />
                    </Pressable>
                  </View>
                </View>
                {index < iaItems.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })}
        {!loading && iaItems.length === 0 && (
          <Text style={styles.emptyText}>
            {t('avaliacoes.empty') ||
              'Nenhuma IA cadastrada ainda. Use o backend para criar algumas entradas primeiro.'}
          </Text>
        )}
      </ScrollView>

      <Modal
        transparent
        visible={!!selectedIa}
        animationType="fade"
        onRequestClose={() => {
          if (busy) return;
          setSelectedIa(null);
          setScoreText('');
          setComment('');
          setErrorField('');
        }}
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
                <Text style={styles.modalTitle}>
                  {selectedIa.name || selectedIa.nome}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {t('avaliacoes.modalSubtitle') ||
                    'Avalie esta IA de 0 a 10 e compartilhe um comentário.'}
                </Text>

                <Text style={styles.modalLabel}>
                  {t('avaliacoes.fields.nota') || 'Nota (0 a 10)'}
                </Text>
                <TextInput
                  style={styles.modalInput}
                  value={scoreText}
                  onChangeText={(val) => {
                    setScoreText(val);
                    if (errorField) setErrorField('');
                  }}
                  placeholder={
                    t('avaliacoes.placeholders.nota') || 'Ex.: 8'
                  }
                  placeholderTextColor={theme.colors.subtext}
                  keyboardType="numeric"
                />
                {errorField ? (
                  <Text
                    style={[
                      styles.modalSubtitle,
                      { color: theme.colors.error },
                    ]}
                  >
                    {errorField}
                  </Text>
                ) : null}

                <Text style={styles.modalLabel}>
                  {t('avaliacoes.fields.comentario') ||
                    'Comentário (opcional)'}
                </Text>
                <TextInput
                  style={[styles.modalInput, styles.formTextArea]}
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  placeholder={
                    t('avaliacoes.placeholders.comentario') ||
                    'Compartilhe como essa IA te ajudou nos estudos.'
                  }
                  placeholderTextColor={theme.colors.subtext}
                />

                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => {
                      if (busy) return;
                      setSelectedIa(null);
                      setScoreText('');
                      setComment('');
                      setErrorField('');
                    }}
                    disabled={busy}
                  >
                    <Text style={styles.modalButtonText}>
                      {t('common.cancel') || 'Cancelar'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={handleSave}
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
                        : t('avaliacoes.actions.save') ||
                          'Salvar avaliação'}
                    </Text>
                  </Pressable>
                </View>

                {fieldErrors && Object.keys(fieldErrors).length > 0 && (
                  <Text style={styles.emptyText}>
                    {Object.values(fieldErrors).join(' ')}
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      {renderToast()}
    </>
  );
}
