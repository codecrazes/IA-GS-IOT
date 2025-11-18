import React, { useMemo } from 'react';
import {
  Pressable,
  Text,
  ViewStyle,
  ActivityIndicator,
  StyleProp,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@theme/useTheme';

type Props = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    button: {
      borderRadius: 999,
      paddingVertical: theme.spacing(3),
      paddingHorizontal: theme.spacing(6),
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 56,
      flexDirection: 'row',
      backgroundColor: theme.colors.primary,
    },
    buttonDisabled: {
      backgroundColor: theme.colors.border,
    },
    buttonPressed: {
      opacity: 0.9,
    },
    loader: {
      marginRight: 8,
    },
    text: {
      color: theme.colors.primaryText,
      fontSize: theme.font.body,
      fontFamily: theme.fontFamily.medium,
    },
  });

export default function Button({ title, onPress, disabled, loading, style }: Props) {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
        style,
      ]}
    >
      {loading && (
        <ActivityIndicator
          style={styles.loader}
          color={theme.colors.primaryText}
        />
      )}

      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}
