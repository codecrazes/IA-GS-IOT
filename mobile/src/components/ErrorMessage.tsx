import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@theme/useTheme';

type Props = {
  text?: string;
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      marginTop: theme.spacing(1),
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.error,
      marginRight: theme.spacing(1),
    },
    text: {
      color: theme.colors.error,
      fontSize: theme.font.xs ?? 12,
      fontFamily: theme.fontFamily.medium,
      textAlign: 'left',
    },
  });

export default function ErrorMessage({ text }: Props) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!text) return null;

  return (
    <View style={styles.container}>
      <View style={styles.dot} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}
