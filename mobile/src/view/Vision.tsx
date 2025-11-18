import * as ImagePicker from 'expo-image-picker';
import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@theme/useTheme';
import { postVisaoAmbienteTrabalho, VisaoAmbienteResponse } from '@fetcher/visionFetcher';

const createStyles = (theme: any) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing(4),
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(6),
      gap: theme.spacing(4),
    },
    title: {
      fontSize: theme.font.h2,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing(1),
    },
    subtitle: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
      marginBottom: theme.spacing(2),
    },
    image: {
      width: '100%',
      height: 220,
      borderRadius: theme.radius.lg,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    sectionTitle: {
      fontSize: theme.font.md,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.text,
      marginTop: theme.spacing(2),
    },
    text: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
      marginTop: theme.spacing(0.5),
    },
    bullet: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.text,
      marginTop: theme.spacing(0.5),
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    chip: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing(2),
      paddingVertical: theme.spacing(1),
    },
    chipText: {
      fontSize: theme.font.xs,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
    },
  });

const VisionScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [result, setResult] = useState<VisaoAmbienteResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert('Permissão de acesso à galeria é necessária.');
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!res.canceled) {
      const asset = res.assets[0];
      setImageUri(asset.uri);
      setResult(null);
    }
  }

  async function handleAnalyze() {
    if (!imageUri) {
      alert('Escolha uma foto do seu ambiente primeiro.');
      return;
    }

    setLoading(true);
    try {
      const r = await postVisaoAmbienteTrabalho(imageUri, 'image/jpeg');
      setResult(r);
    } catch (e) {
      console.log('VISION ERROR =====>', e);
      alert('Erro ao analisar ambiente com IA.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View>
          <Text style={styles.title}>Ambiente de trabalho com IA</Text>
          <Text style={styles.subtitle}>
            Tire uma foto do seu espaço de estudo/trabalho e a IA avalia ergonomia,
            iluminação, organização e sugere melhorias.
          </Text>

          <Button title="Escolher foto do ambiente" onPress={pickImage} />

          {imageUri && (
            <>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <Button
                title={loading ? 'Analisando...' : 'Analisar ambiente com IA'}
                onPress={handleAnalyze}
                disabled={loading}
              />
            </>
          )}

          {loading && (
            <View style={{ marginTop: 16 }}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          )}

          {result && (
            <View style={{ marginTop: 24 }}>
              <Text style={styles.sectionTitle}>Classificação geral</Text>
              <Text style={styles.text}>{result.classificacao_geral}</Text>

              <View style={styles.chipRow}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    Ergonomia: {result.ergonomia?.nivel || 'avaliada'}
                  </Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    Iluminação: {result.iluminacao?.nivel || 'avaliada'}
                  </Text>
                </View>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    Organização: {result.organizacao?.nivel || 'avaliada'}
                  </Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Ergonomia</Text>
              {result.ergonomia && (
                <>
                  <Text style={styles.text}>
                    Postura provável: {result.ergonomia.postura_provavel}
                  </Text>
                  <Text style={styles.text}>
                    Altura da tela: {result.ergonomia.altura_tela}
                  </Text>
                  <Text style={styles.text}>
                    Altura da cadeira: {result.ergonomia.altura_cadeira}
                  </Text>
                  {result.ergonomia.riscos?.map((r: string, i: number) => (
                    <Text key={i} style={styles.bullet}>
                      • {r}
                    </Text>
                  ))}
                </>
              )}

              <Text style={styles.sectionTitle}>Iluminação</Text>
              {result.iluminacao && (
                <>
                  <Text style={styles.text}>
                    Nível: {result.iluminacao.nivel}
                  </Text>
                  {result.iluminacao.fontes?.map((f: string, i: number) => (
                    <Text key={i} style={styles.bullet}>
                      • {f}
                    </Text>
                  ))}
                  {result.iluminacao.problemas?.map((p: string, i: number) => (
                    <Text key={i} style={styles.bullet}>
                      ⚠ {p}
                    </Text>
                  ))}
                </>
              )}

              <Text style={styles.sectionTitle}>Organização</Text>
              {result.organizacao && (
                <>
                  <Text style={styles.text}>
                    Nível: {result.organizacao.nivel}
                  </Text>
                  <Text style={styles.text}>Itens na mesa:</Text>
                  {result.organizacao.itens_na_mesa?.map((it: string, i: number) => (
                    <Text key={i} style={styles.bullet}>
                      • {it}
                    </Text>
                  ))}
                  <Text style={styles.text}>Possíveis distrações:</Text>
                  {result.organizacao.distracoes?.map((d: string, i: number) => (
                    <Text key={i} style={styles.bullet}>
                      • {d}
                    </Text>
                  ))}
                </>
              )}

              <Text style={styles.sectionTitle}>Recomendações da IA</Text>
              {result.recomendacoes?.map((rec: string, i: number) => (
                <Text key={i} style={styles.bullet}>
                  ✔ {rec}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VisionScreen;
