import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@theme/useTheme';
import { AuthContext } from '@context/AuthContext';
import {
  carregarEcoConsumoUsuario,
  carregarIasMaisUsadas,
  carregarResumoUsoIa,
} from '@service/analyticsService';
import type {
  EcoConsumoUsuarioResponse,
  IasMaisUsadasResponse,
  ResumoUsoIaResponse,
} from '@fetcher/analyticsFetcher';

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
    sectionCard: {
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      padding: theme.spacing(4),
    },
    sectionTitle: {
      fontSize: theme.font.lg,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing(1),
    },
    sectionSubtitle: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
      marginBottom: theme.spacing(3),
    },
    label: {
      fontSize: theme.font.xs,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.subtext,
      marginTop: theme.spacing(1),
    },
    text: {
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
    iaItem: {
      marginTop: theme.spacing(1.5),
      paddingVertical: theme.spacing(1),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    iaName: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.text,
    },
    iaDetail: {
      fontSize: theme.font.xs,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
    },
    errorText: {
      fontSize: theme.font.xs,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.danger ?? '#B00020',
      marginTop: theme.spacing(1),
    },
  });

const InsightsScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { token, email } = useContext(AuthContext);

  const usuarioId = email || 'anon';

  const [loading, setLoading] = useState(true);
  const [eco, setEco] = useState<EcoConsumoUsuarioResponse | null>(null);
  const [ias, setIas] = useState<IasMaisUsadasResponse | null>(null);
  const [resumo, setResumo] = useState<ResumoUsoIaResponse | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function carregarTudo() {
      setLoading(true);
      setErro(null);

      const [ecoRes, iasRes, resumoRes] = await Promise.all([
        carregarEcoConsumoUsuario(usuarioId, token || undefined),
        carregarIasMaisUsadas(token || undefined),
        carregarResumoUsoIa(usuarioId, token || undefined),
      ]);

      if (!isMounted) return;

      console.log('INSIGHTS DEBUG ecoRes =>', ecoRes);
      console.log('INSIGHTS DEBUG iasRes =>', iasRes);
      console.log('INSIGHTS DEBUG resumoRes =>', resumoRes);

      if (!ecoRes.ok) setErro((prev) => prev || ecoRes.erroGeral || null);
      else setEco(ecoRes.data);

      if (!iasRes.ok) setErro((prev) => prev || iasRes.erroGeral || null);
      else setIas(iasRes.data);

      if (!resumoRes.ok)
        setErro((prev) => prev || resumoRes.erroGeral || null);
      else setResumo(resumoRes.data);

      setLoading(false);
    }

    carregarTudo();

    return () => {
      isMounted = false;
    };
  }, [token, usuarioId]);

  function getNivelDescricao(nivel?: string | null) {
    switch (nivel) {
      case 'baixo':
        return 'Baixo – uso bem ecológico';
      case 'moderado':
        return 'Moderado – equilibrado';
      case 'alto':
        return 'Alto – considere otimizar o uso das IAs';
      default:
        return 'Nível ainda não calculado';
    }
  }

  // Helpers defensivos para números
  function formatNumber(n: any, digits: number) {
    const num = typeof n === 'number' ? n : Number(n);
    if (Number.isNaN(num)) return '-';
    return num.toFixed(digits);
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. Resumo do uso da IA (texto do mentor) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Resumo do seu uso de IA</Text>
          <Text style={styles.sectionSubtitle}>
            A IA analisa como você tem usado as ferramentas e traz um resumo com
            destaques e recomendações personalizadas.
          </Text>

          {loading && !resumo && (
            <ActivityIndicator color={theme.colors.primary} />
          )}

          {resumo && (
            <>
              <Text style={styles.label}>Destaque</Text>
              <Text style={styles.text}>{resumo.destaque}</Text>

              <Text style={styles.label}>Resumo</Text>
              <Text style={styles.text}>{resumo.texto_resumo}</Text>

              <Text style={styles.label}>Recomendações</Text>
              {resumo.recomendacoes?.map((rec, idx) => (
                <Text key={idx} style={styles.text}>
                  • {rec}
                </Text>
              ))}
            </>
          )}

          {!loading && !resumo && !erro && (
            <Text style={styles.text}>
              Ainda não há dados suficientes para gerar um resumo personalizado.
            </Text>
          )}
        </View>

        {/* 2. Consumo ecológico */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Impacto ecológico estimado</Text>
          <Text style={styles.sectionSubtitle}>
            Estimativa de consumo de energia e pegada de carbono gerada pelas
            chamadas de IA associadas ao seu usuário.
          </Text>

          {loading && !eco && (
            <ActivityIndicator color={theme.colors.primary} />
          )}

          {eco && (
            <>
              <Text style={styles.label}>Chamadas de IA</Text>
              <Text style={styles.text}>
                {typeof eco.total_chamadas === 'number'
                  ? eco.total_chamadas
                  : Number(eco.total_chamadas) || 0}
              </Text>

              <Text style={styles.label}>Energia estimada</Text>
              <Text style={styles.text}>
                {formatNumber(eco.kwh_estimado, 3)} kWh (estimado)
              </Text>

              <Text style={styles.label}>Pegada de carbono</Text>
              <Text style={styles.text}>
                {formatNumber(eco.co2_estimado_kg, 3)} kg CO₂ (equivalente)
              </Text>

              <View style={styles.chipRow}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    {getNivelDescricao(eco.nivel_consumo)}
                  </Text>
                </View>
                {eco.ia_mais_utilizada && (
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>
                      IA mais utilizada: {eco.ia_mais_utilizada}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}

          {!loading && !eco && !erro && (
            <Text style={styles.text}>
              Ainda não foi possível estimar seu impacto ecológico. Use o app
              por mais um tempo para gerarmos os dados.
            </Text>
          )}
        </View>

        {/* 3. IAs mais usadas */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>IAs que você mais usa</Text>
          <Text style={styles.sectionSubtitle}>
            Ranking das IAs mais acionadas, com foco em entender seu perfil e
            sugerir combinações mais sustentáveis.
          </Text>

          {loading && !ias && (
            <ActivityIndicator color={theme.colors.primary} />
          )}

          {ias && ias.ias && ias.ias.length === 0 && (
            <Text style={styles.text}>
              Ainda não temos dados suficientes de uso para montar o ranking.
            </Text>
          )}

          {ias &&
            ias.ias &&
            ias.ias.length > 0 &&
            ias.ias.map((ia) => (
              <View key={ia.ia_id} style={styles.iaItem}>
                <Text style={styles.iaName}>{ia.nome}</Text>
                <Text style={styles.iaDetail}>
                  {ia.usos} uso(s)
                  {typeof ia.eco_score === 'number'
                    ? ` · Eco-score: ${formatNumber(ia.eco_score, 1)}/10`
                    : ''}
                </Text>
              </View>
            ))}

          {!loading && (!ias || !ias.ias) && !erro && (
            <Text style={styles.text}>
              Não foi possível carregar o ranking de IAs neste momento.
            </Text>
          )}
        </View>

        {erro && <Text style={styles.errorText}>{erro}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InsightsScreen;
