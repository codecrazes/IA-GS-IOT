
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

import copyIcon from '@assets/icons/copy.svg';
import copyIconDark from '@assets/icons/copy-dark.svg';
import binIcon from '@assets/icons/bin.svg';
import binIconDark from '@assets/icons/bin-dark.svg';
import editIcon from '@assets/icons/edit.svg';
import editIconDark from '@assets/icons/edit-dark.svg';

import { useToast } from '@components/useToast';
import { usePromptsControl } from '@control/usePromptsControl';

type PromptsManagerProps = {
  token?: string | null;
};

type PromptApi = any;

function createPromptsStyles(theme: any) {
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
  });
}

export default function PromptsManager({ token }: PromptsManagerProps) {
  const { t } = useTranslation();
  const { theme, mode } = useTheme();
  const styles = useMemo(() => createPromptsStyles(theme), [theme]);
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [search, setSearch] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PromptApi | null>(null);
  const [editingInModal, setEditingInModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PromptApi | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const {
    items,
    loading,
    busy,
    error,
    fieldErrors,
    addPrompt,
    editPrompt,
    removePrompt,
  } = usePromptsControl(token);
  const { visible, text, type, show, hide } = useToast();
  const isDark = mode === 'dark';
  const pasteSource = isDark ? copyIconDark : copyIcon;
  const binSource = isDark ? binIconDark : binIcon;
  const editSource = isDark ? editIconDark : editIcon;

  useEffect(() => {
    if (error) {
      show(
        t('prompts.errors.load') ||
          'Não foi possível carregar os prompts. Tente novamente.',
        'error',
      );
    }
  }, [error, show, t]);

  useEffect(() => {
    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
      const first = Object.values(fieldErrors)[0];
      if (first) {
        show(first, 'error');
      }
    }
  }, [fieldErrors, show]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (it: any) =>
        it.titulo.toLowerCase().includes(term) ||
        it.descricao.toLowerCase().includes(term),
    );
  }, [items, search]);

  const truncate = (text: string) => {
    if (!text) return '';
    if (text.length <= 20) return text;
    return `${text.slice(0, 20).trim()}...`;
  };

  const handleOpenDetail = (item: PromptApi) => {
    setSelectedItem(item);
    setEditName(item.titulo);
    setEditDescription(item.descricao);
    setEditingInModal(false);
    setDetailVisible(true);
  };

  const handleCopy = async (promptText: string) => {
    if (!promptText) return;
    await Clipboard.setStringAsync(promptText);
    show(t('prompts.toasts.copied') || 'Prompt copiado!', 'success');
  };

  const handleConfirmDelete = (item: PromptApi) => {
    setItemToDelete(item);
    setDeleteVisible(true);
  };

  const performDelete = async () => {
    if (!itemToDelete) {
      setDeleteVisible(false);
      return;
    }
    const res = await removePrompt(itemToDelete.id);
    if (res.ok) {
      if (selectedItem && selectedItem.id === itemToDelete.id) {
        setDetailVisible(false);
        setSelectedItem(null);
        setEditingInModal(false);
      }
      show(
        t('prompts.toasts.deleted') || 'Prompt excluído com sucesso!',
        'success',
      );
    } else {
      show(
        res.erroGeral ||
          t('prompts.errors.delete') ||
          'Não foi possível excluir o prompt. Tente novamente.',
        'error',
      );
    }
    setItemToDelete(null);
    setDeleteVisible(false);
  };

  const saveEdit = async () => {
    if (!selectedItem) return;
    if (!editName.trim() || !editDescription.trim()) {
      show(
        t('prompts.errors.validation') ||
          'Preencha nome e prompt antes de salvar.',
        'error',
      );
      return;
    }
    const res = await editPrompt(selectedItem.id, {
      titulo: editName.trim(),
      descricao: editDescription.trim(),
    });
    if (res.ok) {
      setSelectedItem(res.data);
      setEditingInModal(false);
      show(
        t('prompts.toasts.updated') || 'Prompt atualizado com sucesso!',
        'success',
      );
    } else {
      show(
        res.erroGeral ||
          t('prompts.errors.update') ||
          'Não foi possível atualizar o prompt. Tente novamente.',
        'error',
      );
    }
  };

  const cancelEdit = () => {
    if (!selectedItem) return;
    setEditName(selectedItem.titulo);
    setEditDescription(selectedItem.descricao);
    setEditingInModal(false);
  };

  const saveNewPrompt = async () => {
    if (!formName.trim() || !formDescription.trim()) {
      show(
        t('prompts.errors.validation') ||
          'Preencha nome e prompt antes de salvar.',
        'error',
      );
      return;
    }
    const res = await addPrompt({
      titulo: formName.trim(),
      descricao: formDescription.trim(),
    });
    if (res.ok) {
      setFormName('');
      setFormDescription('');
      setViewMode('list');
      show(
        t('prompts.toasts.created') || 'Prompt criado com sucesso!',
        'success',
      );
    } else {
      show(
        res.erroGeral ||
          t('prompts.errors.create') ||
          'Não foi possível criar o prompt. Tente novamente.',
        'error',
      );
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
          {viewMode === 'list'
            ? t('prompts.listTitle') || 'Prompts cadastrados'
            : t('prompts.newTitle') || 'Novo prompt'}
        </Text>
        <Pressable
          style={styles.manageTabButton}
          onPress={() => setViewMode(viewMode === 'list' ? 'form' : 'list')}
        >
          <Text style={styles.manageTabText}>
            {viewMode === 'list'
              ? t('prompts.actions.new') || 'Novo prompt'
              : t('prompts.actions.backToList') || 'Ver lista'}
          </Text>
        </Pressable>
      </View>

      {viewMode === 'list' ? (
        <>
          <TextInput
            style={styles.searchInput}
            placeholder={
              t('prompts.searchPlaceholder') ||
              'Buscar por nome ou conteúdo do prompt'
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
                {t('prompts.loading') || 'Carregando prompts...'}
              </Text>
            )}

            {!loading &&
              filtered.map((item: PromptApi, index: number) => (
                <View key={item.id}>
                  <View style={styles.genericItemRow}>
                    <View style={styles.genericItemTitleRow}>
                      <Pressable
                        style={styles.iaLeft}
                        onPress={() => handleOpenDetail(item)}
                      >
                        <Text style={styles.genericItemTitle}>
                          {item.titulo}
                        </Text>
                        <Text style={styles.genericItemDescription}>
                          {truncate(item.descricao)}
                        </Text>
                      </Pressable>
                      <View style={styles.genericItemActions}>
                        <Pressable
                          style={styles.iconButton}
                          onPress={() => handleCopy(item.descricao)}
                        >
                          <Image
                            source={pasteSource}
                            style={styles.iconImage}
                            resizeMode="contain"
                          />
                        </Pressable>
                        <Pressable
                          style={styles.iconButton}
                          onPress={() => handleConfirmDelete(item)}
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
                {t('prompts.empty') || 'Nenhum prompt cadastrado ainda.'}
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
            {t('prompts.fields.name') || 'Nome do prompt'}
          </Text>
          <TextInput
            style={styles.formInput}
            placeholder={
              t('prompts.placeholders.name') || 'Ex.: Estudo guiado para prova'
            }
            placeholderTextColor={theme.colors.subtext}
            value={formName}
            onChangeText={setFormName}
          />

          <Text style={styles.formLabel}>
            {t('prompts.fields.description') || 'Prompt'}
          </Text>
          <TextInput
            style={[styles.formInput, styles.formTextArea]}
            placeholder={
              t('prompts.placeholders.description') ||
              'Cole aqui o prompt completo que você quer reutilizar.'
            }
            placeholderTextColor={theme.colors.subtext}
            value={formDescription}
            onChangeText={setFormDescription}
            multiline
          />

          <View style={styles.formActionsRow}>
            <Pressable
              onPress={() => {
                setViewMode('list');
                setFormName('');
                setFormDescription('');
              }}
              style={styles.modalButton}
              disabled={busy}
            >
              <Text style={styles.modalButtonText}>
                {t('common.cancel') || 'Cancelar'}
              </Text>
            </Pressable>

            <Pressable
              onPress={saveNewPrompt}
              style={[styles.modalButton, styles.modalButtonPrimary]}
              disabled={busy}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  styles.modalButtonTextPrimary,
                ]}
              >
                {t('common.add') || 'Adicionar'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      <Modal
        transparent
        visible={detailVisible}
        animationType="fade"
        onRequestClose={() => {
          setDetailVisible(false);
          setEditingInModal(false);
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
            {selectedItem && !editingInModal && (
              <>
                <Text style={styles.modalTitle}>{selectedItem.titulo}</Text>
                <Text style={styles.modalLabel}>
                  {t('prompts.fields.description') || 'Prompt'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedItem.descricao}
                </Text>

                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => handleCopy(selectedItem.descricao)}
                  >
                    <Image
                      source={pasteSource}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  </Pressable>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => setEditingInModal(true)}
                  >
                    <Image
                      source={editSource}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  </Pressable>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => handleConfirmDelete(selectedItem)}
                  >
                    <Image
                      source={binSource}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  </Pressable>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => {
                      setDetailVisible(false);
                      setEditingInModal(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>
                      {t('common.close') || 'Fechar'}
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {selectedItem && editingInModal && (
              <>
                <Text style={styles.modalTitle}>
                  {t('prompts.editTitle') || 'Editar prompt'}
                </Text>

                <Text style={styles.formLabel}>
                  {t('prompts.fields.name') || 'Nome do prompt'}
                </Text>
                <TextInput
                  style={styles.formInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder={
                    t('prompts.placeholders.name') ||
                    'Ex.: Estudo guiado para prova'
                  }
                  placeholderTextColor={theme.colors.subtext}
                />

                <Text style={styles.formLabel}>
                  {t('prompts.fields.description') || 'Prompt'}
                </Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  value={editDescription}
                  onChangeText={setEditDescription}
                  multiline
                  placeholder={
                    t('prompts.placeholders.description') ||
                    'Cole aqui o prompt completo que você quer reutilizar.'
                  }
                  placeholderTextColor={theme.colors.subtext}
                />

                <View style={styles.formActionsRow}>
                  <Pressable
                    style={styles.modalButton}
                    onPress={cancelEdit}
                    disabled={busy}
                  >
                    <Text style={styles.modalButtonText}>
                      {t('common.cancel') || 'Cancelar'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={saveEdit}
                    disabled={busy}
                  >
                    <Text
                      style={[
                        styles.modalButtonText,
                        styles.modalButtonTextPrimary,
                      ]}
                    >
                      {t('common.save') || 'Salvar'}
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
              {t('prompts.confirmDelete.title') || 'Excluir prompt'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {t('prompts.confirmDelete.message') ||
                'Tem certeza que deseja excluir este prompt?'}
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalButton}
                onPress={() => setDeleteVisible(false)}
                disabled={busy}
              >
                <Text style={styles.modalButtonText}>
                  {t('prompts.confirmDelete.cancel') || 'Cancelar'}
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
                  {t('prompts.confirmDelete.confirm') || 'Excluir'}
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
