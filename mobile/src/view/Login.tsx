import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { useAuthControl } from '@control/useAuthControl';
import { useTheme } from '@theme/useTheme';
import Input from '@components/Input';
import Button from '@components/Button';
import ErrorMessage from '@components/ErrorMessage';
import Loading from '@components/Loading';

import logoLight from '@assets/logo.png';
import logoDark from '@assets/logo-dark.svg';

function useToast() {
  const [msg, setMsg] = React.useState<string | null>(null);
  const y = useMemo(() => new Animated.Value(-80), []);

  function show(text: string) {
    setMsg(text);
    Animated.spring(y, { toValue: 20, useNativeDriver: false }).start(() => {
      setTimeout(() => {
        Animated.timing(y, {
          toValue: -80,
          duration: 200,
          useNativeDriver: false,
        }).start(() => setMsg(null));
      }, 1500);
    });
  }

  return { msg, y, show };
}

const createStyles = (theme: any, insetTop: number, insetBottom: number) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: theme.spacing(4),
      paddingBottom: insetBottom + theme.spacing(4),
    },
    card: {
      width: '100%',
      maxWidth: 380,
      backgroundColor: theme.colors.card,
      borderRadius: theme.radius.lg,
      paddingHorizontal: theme.spacing(4),
      paddingVertical: theme.spacing(5),
      height: 525,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
    toast: {
      position: 'absolute',
      left: 16,
      right: 16,
      zIndex: 10,
      backgroundColor: theme.colors.card,
      borderColor: theme.colors.border,
      padding: theme.spacing(3),
      borderRadius: theme.radius.sm,
    },
    toastText: {
      color: theme.colors.text,
      textAlign: 'center',
      fontFamily: theme.fontFamily.regular,
    },
    logoContainer: {
      position: 'absolute',
      zIndex: 20,
      top: insetTop + theme.spacing(4),
      left: theme.spacing(4),
    },
    logoBadge: {
      borderRadius: 16,
      padding: theme.spacing(2),
    },
    logo: {
      width: 51,
      height: 51,
      borderRadius: 16,
      resizeMode: 'contain',
    },
    title: {
      fontSize: theme.font.h1,
      textAlign: 'center',
      marginBottom: theme.spacing(4),
      marginTop: theme.spacing(6),
      color: theme.colors.text,
      fontFamily: theme.fontFamily.semiBold,
    },
    subtitle: {
      fontSize: theme.font.sm,
      textAlign: 'center',
      marginBottom: theme.spacing(8),
      color: theme.colors.subtext,
      fontFamily: theme.fontFamily.regular,
      width: '60%',
    },
    input: {
      marginRight: 10,
      marginLeft: 10,
    },
    button: {
      width: '94%',
      marginTop: theme.spacing(4),
      marginRight: 10,
      marginLeft: 10,
    },
    footerText: {
      textAlign: 'center',
      color: theme.colors.text,
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      marginTop: theme.spacing(4),
    },
    footerLink: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.semiBold,
    },
  });

const Login: React.FC = () => {
  const nav = useNavigation<any>();
  const { theme, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { usuario, erros, erroGeral, loading, onChange, onLogin } = useAuthControl();
  const toast = useToast();

  const styles = useMemo(
    () => createStyles(theme, insets.top, insets.bottom),
    [theme, insets.top, insets.bottom],
  );

  const logoSource = mode === 'dark' ? logoDark : logoLight;

  const canSubmit =
    !!usuario.email && !!usuario.senha && !erros.email && !erros.senha && !loading;

  React.useEffect(() => {
    if (erroGeral) toast.show(erroGeral);
  }, [erroGeral]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      edges={['bottom', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.screen}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBadge}>
                <Image source={logoSource} style={styles.logo} />
              </View>
            </View>

            {toast.msg && (
              <Animated.View style={[styles.toast, { top: toast.y }]}>
                <Text style={styles.toastText}>{toast.msg}</Text>
              </Animated.View>
            )}

            <View style={styles.card}>
              <Text style={styles.title}>{t('login.title') || 'Login'}</Text>

              <Text style={styles.subtitle}>
                {t('login.subtitle') || 'Faça login com seu usuário e senha'}
              </Text>

              <Input
                placeholder={t('login.email') || 'Email'}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                returnKeyType="next"
                value={usuario.email}
                onChangeText={(tval) => onChange('email', tval)}
                style={styles.input}
              />
              <ErrorMessage text={erros.email} />

              <View style={{ height: theme.spacing(3) }} />

              <Input
                placeholder={t('login.password') || 'Senha'}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={onLogin}
                value={usuario.senha}
                onChangeText={(tval) => onChange('senha', tval)}
                style={styles.input}
              />
              <ErrorMessage text={erros.senha} />

              <View style={{ height: theme.spacing(5) }} />

              <Button
                title={t('actions.signIn') || 'Entrar'}
                onPress={onLogin}
                disabled={!canSubmit}
                style={styles.button}
              />

              <View style={{ height: theme.spacing(4) }} />

              <Text style={styles.footerText}>
                {t('login.noAccountPrefix') || 'Não tem conta?'}{' '}
                <Text onPress={() => nav.navigate('Register')} style={styles.footerLink}>
                  {t('login.noAccount') || 'Cadastre-se'}
                </Text>
              </Text>
            </View>

            <Loading visible={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
