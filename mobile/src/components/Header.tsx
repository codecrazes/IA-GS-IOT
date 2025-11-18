import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '@theme/useTheme';

import logoLight from '@assets/logo.png';
import logoDark from '@assets/logo-dark.svg';

import notificationsLight from '@assets/icons/notifications.svg';
import notificationsDark from '@assets/icons/notifications-dark.svg';
import notificationsOnLight from '@assets/icons/notifications-on.svg';
import notificationsOnDark from '@assets/icons/notifications-on-dark.svg';

import settingsLight from '@assets/icons/settings.svg';
import settingsDark from '@assets/icons/settings-dark.svg';

type NotificationItem = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  read: boolean;
};

const createStyles = (theme: any, insetTop: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing(4),
      paddingTop: insetTop + theme.spacing(2),
      paddingBottom: theme.spacing(2),
      backgroundColor: theme.colors.bg,
    },
    logoBadge: {
      backgroundColor: theme.colors.primary,
      borderRadius: 16,
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(1),
    },
    logoImage: {
      width: 51,
      height: 51,
      resizeMode: 'contain',
      borderRadius: 17,
    },
    rightActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing(3),
      marginRight: theme.spacing(1),
    },
    iconButton: {
      width: 51,
      height: 51,
      borderRadius: 17,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    iconButtonRight: {
      marginLeft: theme.spacing(2),
    },
    iconImage: {
      width: 48,
      height: 48,
      resizeMode: 'contain',
    },
    notificationDot: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.textSecondary ?? theme.colors.primary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing(4),
    },
    modalCard: {
      width: '100%',
      maxWidth: 380,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      paddingVertical: theme.spacing(4),
      paddingHorizontal: theme.spacing(4),
    },
    modalTitle: {
      fontSize: theme.font.h2,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing(3),
    },
    modalSubtitle: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
      marginBottom: theme.spacing(3),
    },
    notificationItem: {
      paddingVertical: theme.spacing(3),
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing(2),
      paddingHorizontal: theme.spacing(3),
      backgroundColor: theme.colors.bg,
      flexDirection: 'row',
    },
    notificationIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(2),
      backgroundColor: theme.colors.error,
    },
    notificationIndicatorRead: {
      backgroundColor: theme.colors.border,
    },
    notificationTextWrapper: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing(1),
    },
    notificationDescription: {
      fontSize: theme.font.xs ?? 12,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
    },
    modalFooterButton: {
      marginTop: theme.spacing(2),
      alignSelf: 'flex-end',
    },
    modalFooterText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.primary,
    },
    settingsSection: {
      marginBottom: theme.spacing(3),
    },
    settingsSectionTitle: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing(2),
    },
    settingsOptionsRow: {
      flexDirection: 'row',
    },
    settingsOption: {
      flex: 1,
      paddingVertical: theme.spacing(2),
      borderRadius: theme.radius.md,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingsOptionLeft: {
      marginRight: theme.spacing(1),
    },
    settingsOptionRight: {
      marginLeft: theme.spacing(1),
    },
    settingsOptionActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.bg,
    },
    settingsOptionInactive: {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
    },
    settingsOptionTextActive: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.primary,
    },
    settingsOptionTextInactive: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
    },
  });

const Header: React.FC = () => {
  const { theme, mode, setMode } = useTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>(i18n.language || 'pt');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'welcome',
      titleKey: 'header.notifications.items.welcome.title',
      descriptionKey: 'header.notifications.items.welcome.description',
      read: false,
    },
    {
      id: 'beta',
      titleKey: 'header.notifications.items.beta.title',
      descriptionKey: 'header.notifications.items.beta.description',
      read: false,
    },
  ]);

  useEffect(() => {
    const handler = (lng: string) => setCurrentLang(lng);
    i18n.on('languageChanged', handler);
    setCurrentLang(i18n.language || 'pt');
    return () => {
      i18n.off('languageChanged', handler);
    };
  }, [i18n]);

  const styles = useMemo(
    () => createStyles(theme, insets.top),
    [theme, insets.top],
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const currentLogo = mode === 'dark' ? logoDark : logoLight;
  const notificationsBaseIcon = mode === 'dark' ? notificationsDark : notificationsLight;
  const notificationsOnIcon = mode === 'dark' ? notificationsOnDark : notificationsOnLight;
  const notificationIcon = unreadCount > 0 ? notificationsOnIcon : notificationsBaseIcon;
  const currentSettingsIcon = mode === 'dark' ? settingsDark : settingsLight;

  function handleOpenNotifications() {
    setNotificationsVisible(true);
  }

  function handleOpenSettings() {
    setSettingsVisible(true);
  }

  function handleCloseNotifications() {
    setNotificationsVisible(false);
  }

  function handleCloseSettings() {
    setSettingsVisible(false);
  }

  function markNotificationAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function handleChangeMode(nextMode: 'light' | 'dark') {
    setMode(nextMode);
  }

  async function handleChangeLanguage(lang: 'pt' | 'es') {
    if (currentLang.startsWith(lang)) return;
    await AsyncStorage.setItem('appLang', lang);
    await i18n.changeLanguage(lang);
  }

  const isPt = currentLang.startsWith('pt');
  const isEs = currentLang.startsWith('es');

  return (
    <>
      <View style={styles.container}>
        <View style={styles.logoBadge}>
          <Image source={currentLogo} style={styles.logoImage} />
        </View>

        <View style={styles.rightActions}>
          <Pressable style={styles.iconButton} onPress={handleOpenNotifications}>
            <Image source={notificationIcon} style={styles.iconImage} />
          </Pressable>

          <Pressable
            style={[styles.iconButton, styles.iconButtonRight]}
            onPress={handleOpenSettings}
          >
            <Image source={currentSettingsIcon} style={styles.iconImage} />
          </Pressable>
        </View>
      </View>

      <Modal
        transparent
        visible={notificationsVisible}
        animationType="fade"
        onRequestClose={handleCloseNotifications}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('header.notifications.title')}</Text>
            <Text style={styles.modalSubtitle}>{t('header.notifications.subtitle')}</Text>

            {notifications.map((n) => (
              <TouchableOpacity
                key={n.id}
                style={styles.notificationItem}
                onPress={() => markNotificationAsRead(n.id)}
                activeOpacity={0.9}
              >
                <View
                  style={[
                    styles.notificationIndicator,
                    n.read && styles.notificationIndicatorRead,
                  ]}
                />
                <View style={styles.notificationTextWrapper}>
                  <Text style={styles.notificationTitle}>{t(n.titleKey)}</Text>
                  <Text style={styles.notificationDescription}>{t(n.descriptionKey)}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalFooterButton}
              onPress={handleCloseNotifications}
              activeOpacity={0.8}
            >
              <Text style={styles.modalFooterText}>{t('header.actions.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={settingsVisible}
        animationType="fade"
        onRequestClose={handleCloseSettings}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('header.settings.title')}</Text>

            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>
                {t('header.settings.themeTitle')}
              </Text>
              <View style={styles.settingsOptionsRow}>
                <TouchableOpacity
                  style={[
                    styles.settingsOption,
                    styles.settingsOptionLeft,
                    mode === 'light'
                      ? styles.settingsOptionActive
                      : styles.settingsOptionInactive,
                  ]}
                  onPress={() => handleChangeMode('light')}
                  activeOpacity={0.9}
                >
                  <Text
                    style={
                      mode === 'light'
                        ? styles.settingsOptionTextActive
                        : styles.settingsOptionTextInactive
                    }
                  >
                    {t('header.settings.themeLight')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.settingsOption,
                    styles.settingsOptionRight,
                    mode === 'dark'
                      ? styles.settingsOptionActive
                      : styles.settingsOptionInactive,
                  ]}
                  onPress={() => handleChangeMode('dark')}
                  activeOpacity={0.9}
                >
                  <Text
                    style={
                      mode === 'dark'
                        ? styles.settingsOptionTextActive
                        : styles.settingsOptionTextInactive
                    }
                  >
                    {t('header.settings.themeDark')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>
                {t('header.settings.languageTitle')}
              </Text>
              <View style={styles.settingsOptionsRow}>
                <TouchableOpacity
                  style={[
                    styles.settingsOption,
                    styles.settingsOptionLeft,
                    isPt
                      ? styles.settingsOptionActive
                      : styles.settingsOptionInactive,
                  ]}
                  onPress={() => handleChangeLanguage('pt')}
                  activeOpacity={0.9}
                >
                  <Text
                    style={
                      isPt
                        ? styles.settingsOptionTextActive
                        : styles.settingsOptionTextInactive
                    }
                  >
                    {t('header.settings.languagePt')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.settingsOption,
                    styles.settingsOptionRight,
                    isEs
                      ? styles.settingsOptionActive
                      : styles.settingsOptionInactive,
                  ]}
                  onPress={() => handleChangeLanguage('es')}
                  activeOpacity={0.9}
                >
                  <Text
                    style={
                      isEs
                        ? styles.settingsOptionTextActive
                        : styles.settingsOptionTextInactive
                    }
                  >
                    {t('header.settings.languageEs')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalFooterButton}
              onPress={handleCloseSettings}
              activeOpacity={0.8}
            >
              <Text style={styles.modalFooterText}>{t('header.actions.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Header;
