import React, { useMemo } from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@theme/useTheme';

type Props = TextInputProps & { errorText?: string };

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    inputBase: {
      borderWidth: 0,
      borderColor: 'transparent',
      borderRadius: 999,
      paddingHorizontal: theme.spacing(4),
      paddingVertical: theme.spacing(3),
      minHeight: 56,
      backgroundColor: theme.colors.bg,
      color: theme.colors.text,
      fontSize: theme.font.body,
      fontFamily: theme.fontFamily.regular,
    },
    inputError: {
      borderWidth: 1,
      borderColor: theme.colors.error,
    },
    errorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing(1),
    },
    errorDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.error,
      marginRight: 6,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
    },
  });

export default function Input({ errorText, style, ...props }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const hasError = !!errorText;

  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor={theme.colors.subtext}
        style={[
          styles.inputBase,
          hasError && styles.inputError,
          style,
        ]}
        {...props}
      />

      {!!errorText && (
        <View style={styles.errorRow}>
          <View style={styles.errorDot} />
          <Text style={styles.errorText}>{errorText}</Text>
        </View>
      )}
    </View>
  );
}
