import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '@theme/useTheme';
import ThemeToggle from '@theme/ThemeToggle';
import { AuthContext } from '@context/AuthContext';
import { getProfileService, updateProfileService } from '@service/userService';
import LanguageToggle from '@i18n/LanguageToggle';

import moneyIconLight from '@assets/icons/money.svg';
import moneyIconDark from '@assets/icons/money-dark.svg';
import userIconLight from '@assets/icons/user.svg';
import userIconDark from '@assets/icons/user-dark.svg';
import translateIconLight from '@assets/icons/translate.svg';
import translateIconDark from '@assets/icons/translate-dark.svg';
import instantIconLight from '@assets/icons/instant.svg';
import instantIconDark from '@assets/icons/instant-dark.svg';

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const y = useMemo(() => new Animated.Value(-80), []);
  function show(text: string) {
    setMsg(text);
    Animated.spring(y, { toValue: 20, useNativeDriver: false }).start(() => {
      setTimeout(
        () =>
          Animated.timing(y, {
            toValue: -80,
            duration: 200,
            useNativeDriver: false,
          }).start(() => setMsg(null)),
        1500,
      );
    });
  }
  return { msg, y, show };
}

const makeStyles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    center: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      paddingHorizontal: theme.spacing(4),
      paddingTop: theme.spacing(4),
    },
    contentCard: {
      flex: 1,
      backgroundColor: theme.colors.card,
      borderRadius: 25,
      paddingHorizontal: theme.spacing(4),
      paddingVertical: theme.spacing(4),
      maxHeight: '95%',
    },
    toast: {
      position: 'absolute',
      left: 16,
      right: 16,
      zIndex: 10,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing(3),
    },
    toastText: {
      color: theme.colors.text,
      textAlign: 'center',
      fontFamily: theme.fontFamily.regular,
    },
    profileRow: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: theme.spacing(4),
    },
    avatarWrapper: {
      width: 51,
      height: 51,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing(3),
    },
    avatarEmoji: {
      fontSize: 25,
    },
    profileTexts: {
      flex: 1,
    },
    profileName: {
      fontSize: theme.font.h3,
      fontFamily: theme.fontFamily.medium,
      paddingTop: theme.spacing(1),
      color: theme.colors.text,
    },
    profileLink: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
      textDecorationLine: 'underline',
    },
    helpBox: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing(3),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing(5),
    },
    helpIconWrapper: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: theme.colors.bg,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing(3),
    },
    helpIconEmoji: {
      fontSize: 22,
    },
    helpTexts: {
      flex: 1,
    },
    helpTitle: {
      fontSize: theme.font.base,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
    },
    helpLink: {
      marginTop: theme.spacing(1),
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.text,
      textDecorationLine: 'underline',
    },
    sectionTitle: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(3),
      fontSize: theme.font.h2,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.text,
    },
    settingsGroup: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      paddingTop: theme.spacing(1),
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: theme.spacing(3),
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing(2),
    },
    settingIcon: {
      fontSize: 20,
      marginRight: theme.spacing(2),
    },
    settingLabel: {
      fontSize: theme.font.base,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
    },
    settingChevron: {
      fontSize: 18,
      color: theme.colors.subtext,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
    },
    logoutWrapper: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(2),
    },
    logoutButton: {
      alignSelf: 'flex-start',
      paddingVertical: theme.spacing(3),
      paddingHorizontal: theme.spacing(8),
      borderRadius: 24,
      backgroundColor: theme.colors.error,
    },
    logoutText: {
      fontSize: theme.font.xs,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.white,
    },
    modalOverlay: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      width: '86%',
      padding: theme.spacing(4),
      borderRadius: theme.radius.lg,
    },
    modalTitle: {
      fontSize: theme.font.h2,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing(2),
    },
    modalMessage: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
      marginBottom: theme.spacing(3),
    },
    modalActions: {
      marginTop: theme.spacing(3),
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    modalButton: {
      paddingVertical: theme.spacing(2),
      paddingHorizontal: theme.spacing(3),
      borderRadius: 999,
      marginLeft: theme.spacing(2),
    },
    modalCancelText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.subtext,
    },
    modalPrimaryText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.primary,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.sm,
      fontSize: theme.font.base,
      height: 50,
      marginTop: theme.spacing(2),
      paddingHorizontal: theme.spacing(3),
      color: theme.colors.text,
      backgroundColor: theme.colors.bg,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    inputErrorText: {
      marginTop: theme.spacing(1),
      fontSize: theme.font.xs,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.error,
    },
    modalTextCenter: {
      fontSize: theme.font.base,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing(3),
    },
    modalButtonsRowCenter: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    modalCancel: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.primary,
    },
    modalExit: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.error,
    },
  });

const Profile: React.FC = () => {
  const { theme, mode } = useTheme();
  const styles = makeStyles(theme);
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { token, email: sessionEmail, fecharSessao } = useContext(AuthContext);

  const toast = useToast();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState(sessionEmail || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  const [editVisible, setEditVisible] = useState(false);
  const [editNome, setEditNome] = useState('');
  const [languageVisible, setLanguageVisible] = useState(false);
  const [themeVisible, setThemeVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  async function carregar() {
    if (!token) return;
    setLoading(true);
    const res = await getProfileService(token);
    setLoading(false);
    if (res.ok) {
      setNome(res.nome || '');
      setEmail(res.email);
      setErroGeral(null);
    } else {
      setErroGeral(res.erroGeral || t('profile.errors.load'));
    }
  }

  useEffect(() => {
    carregar();
  }, [token]);

  const invalidNome = editNome.trim().length < 2;

  const abrirEditarPerfil = () => {
    setEditNome(nome || '');
    setErroGeral(null);
    setEditVisible(true);
  };

  const salvar = async () => {
    if (!token || invalidNome) return;
    setSaving(true);
    const res = await updateProfileService(token, editNome.trim());
    setSaving(false);
    if (res.ok) {
      setErroGeral(null);
      setNome(editNome.trim());
      setEditVisible(false);
      toast.show(t('profile.toast.updated'));
    } else {
      setErroGeral(res.erroGeral || t('profile.errors.save'));
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.center, { backgroundColor: theme.colors.bg }]}
        edges={['bottom', 'left', 'right']}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const displayName =
    nome && nome.trim().length > 0
      ? nome.split(' ')[0]
      : sessionEmail?.split('@')[0] || t('home.defaultName') || 'Estudante';

  const isDark = mode === 'dark';

  const moneyIconSource = isDark ? moneyIconDark : moneyIconLight;
  const userIconSource = isDark ? userIconDark : userIconLight;
  const translateIconSource = isDark ? translateIconDark : translateIconLight;
  const instantIconSource = isDark ? instantIconDark : instantIconLight;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
      edges={['bottom', 'left', 'right']}
    >
      {toast.msg && (
        <Animated.View style={[styles.toast, { top: toast.y }]}>
          <Text style={styles.toastText}>{toast.msg}</Text>
        </Animated.View>
      )}

      <View style={styles.contentCard}>
        <View style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarEmoji}>🧠</Text>
          </View>

          <View style={styles.profileTexts}>
            <Text style={styles.profileName}>{displayName}</Text>
            <TouchableOpacity onPress={abrirEditarPerfil}>
              <Text style={styles.profileLink}>
                {t('profile.viewProfile') || 'Ver Perfil'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.helpBox}>
          <View style={styles.helpIconWrapper}>
            <Image source={moneyIconSource} />
          </View>
          <View style={styles.helpTexts}>
            <Text style={styles.helpTitle}>
              {t('profile.help.title') || 'Alguma dúvida ou sugestão?'}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('About')}>
              <Text style={styles.helpLink}>
                {t('profile.help.link') || 'Saiba mais'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {t('profile.settings.title') || 'Configurações'}
        </Text>

        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={abrirEditarPerfil}
          >
            <View style={styles.settingLeft}>
              <Image source={userIconSource} />
              <Text style={styles.settingLabel}>
                {t('profile.settings.personal') || 'Informações Pessoais'}
              </Text>
            </View>
            <Text style={styles.settingChevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setLanguageVisible(true)}
          >
            <View style={styles.settingLeft}>
              <Image source={translateIconSource} />
              <Text style={styles.settingLabel}>
                {t('profile.language.title') || 'Língua'}
              </Text>
            </View>
            <Text style={styles.settingChevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setThemeVisible(true)}
          >
            <View style={styles.settingLeft}>
              <Image source={instantIconSource} />
              <Text style={styles.settingLabel}>
                {t('profile.appearance.title') || 'Tema'}
              </Text>
            </View>
            <Text style={styles.settingChevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logoutWrapper}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setLogoutVisible(true)}
          >
            <Text style={styles.logoutText}>
              {t('profile.session.signOut') || 'Sair'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent
        visible={editVisible}
        animationType="fade"
        onRequestClose={() => setEditVisible(false)}
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
              {t('profile.data.title') || 'Informações pessoais'}
            </Text>
            <Text style={styles.modalMessage}>
              {t('profile.data.subtitle') ||
                'Atualize como você quer ser chamado dentro do app.'}
            </Text>

            <TextInput
              style={[
                styles.input,
                invalidNome ? styles.inputError : undefined,
              ]}
              placeholder={t('profile.data.namePlaceholder')}
              placeholderTextColor={theme.colors.subtext}
              value={editNome}
              onChangeText={setEditNome}
            />
            {invalidNome && (
              <Text style={styles.inputErrorText}>
                {t('profile.data.nameTooShort')}
              </Text>
            )}
            {!!erroGeral && (
              <Text style={styles.inputErrorText}>{erroGeral}</Text>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setErroGeral(null);
                  setEditVisible(false);
                }}
              >
                <Text style={styles.modalCancelText}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalButton}
                disabled={saving || invalidNome}
                onPress={salvar}
              >
                <Text style={styles.modalPrimaryText}>
                  {saving
                    ? t('common.saving')
                    : t('common.save')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={languageVisible}
        animationType="fade"
        onRequestClose={() => setLanguageVisible(false)}
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
              {t('profile.language.title') || 'Língua'}
            </Text>
            <Text style={styles.modalMessage}>
              {t('profile.language.subtitle') ||
                'Escolha em qual idioma deseja usar o aplicativo.'}
            </Text>

            <LanguageToggle />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setLanguageVisible(false)}
              >
                <Text style={styles.modalCancelText}>
                  {t('common.close') || 'Fechar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={themeVisible}
        animationType="fade"
        onRequestClose={() => setThemeVisible(false)}
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
              {t('profile.appearance.title') || 'Tema'}
            </Text>
            <Text style={styles.modalMessage}>
              {t('profile.appearance.subtitle') ||
                'Alterne entre modo claro e escuro.'}
            </Text>

            <ThemeToggle />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setThemeVisible(false)}
              >
                <Text style={styles.modalCancelText}>
                  {t('common.close') || 'Fechar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={logoutVisible}
        animationType="fade"
        onRequestClose={() => setLogoutVisible(false)}
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
            <Text style={styles.modalTextCenter}>
              {t('profile.session.signOutQuestion')}
            </Text>
            <View style={styles.modalButtonsRowCenter}>
              <TouchableOpacity
                onPress={() => setLogoutVisible(false)}
              >
                <Text style={styles.modalCancel}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setLogoutVisible(false);
                  fecharSessao();
                }}
              >
                <Text style={styles.modalExit}>
                  {t('profile.session.signOut')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
