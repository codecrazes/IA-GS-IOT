import React, { useState, useContext, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@theme/useTheme';
import { AuthContext } from '@context/AuthContext';
import {
  explicarTarefaService,
  planoEstudoService,
  refinarResultadoService,
} from '@service/mentorService';
import type {
  MentorResponseApi,
  PlanoEstudoResponse,
  RefinarResultadoResponse,
} from '@fetcher/mentorFetcher';

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
    input: {
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing(3),
      paddingVertical: theme.spacing(2),
      fontSize: theme.font.sm,
      color: theme.colors.text,
      marginBottom: theme.spacing(2),
      backgroundColor: theme.colors.bg,
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing(2),
    },
    inputSmall: {
      flex: 1,
    },
    button: {
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing(2),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    buttonText: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.primaryText,
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
    tagRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
      marginTop: theme.spacing(1),
    },
    tag: {
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing(2),
      paddingVertical: theme.spacing(1),
    },
    tagText: {
      fontSize: theme.font.xs,
      fontFamily: theme.fontFamily.regular,
      color: theme.colors.subtext,
    },

    // CARD DE RESPOSTA
    responseCard: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(3),
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.bg, // levemente diferente do card da seção
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing(0.5),
    },
    responseHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
    },
    responseTitle: {
      fontSize: theme.font.sm,
      fontFamily: theme.fontFamily.semiBold,
      color: theme.colors.text,
    },
    closeButton: {
      paddingHorizontal: theme.spacing(2),
      paddingVertical: theme.spacing(1),
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    closeButtonText: {
      fontSize: theme.font.xs,
      fontFamily: theme.fontFamily.medium,
      color: theme.colors.subtext,
    },
  });

const MentorScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { token } = useContext(AuthContext);

  // Explicar tarefa
  const [descricao, setDescricao] = useState('');
  const [respExplicar, setRespExplicar] = useState<MentorResponseApi | null>(null);
  const [loadingExplicar, setLoadingExplicar] = useState(false);

  // Plano de estudo
  const [objetivo, setObjetivo] = useState('');
  const [horasSemana, setHorasSemana] = useState('4');
  const [respPlano, setRespPlano] = useState<PlanoEstudoResponse | null>(null);
  const [loadingPlano, setLoadingPlano] = useState(false);

  // Refinar resultado
  const [tipoConteudo, setTipoConteudo] = useState('post_linkedin');
  const [textoInicial, setTextoInicial] = useState('');
  const [tom, setTom] = useState('profissional');
  const [tamanho, setTamanho] = useState('curto');
  const [respRefinar, setRespRefinar] = useState<RefinarResultadoResponse | null>(null);
  const [loadingRefinar, setLoadingRefinar] = useState(false);

  async function handleExplicar() {
    if (!descricao.trim()) {
      alert('Descreva rapidamente a tarefa que você quer ajuda 😉');
      return;
    }
    setLoadingExplicar(true);
    const res = await explicarTarefaService(descricao, undefined, token || undefined);
    setLoadingExplicar(false);
    if (res.ok) setRespExplicar(res.data);
    else alert(res.erroGeral || 'Erro ao consultar mentor (explicar tarefa).');
  }

  async function handlePlano() {
    if (!objetivo.trim()) {
      alert('Informe um objetivo de estudo (ex: aprender IA para marketing).');
      return;
    }
    const h = Number(horasSemana) || 4;
    setLoadingPlano(true);
    const res = await planoEstudoService(objetivo, h);
    setLoadingPlano(false);
    if (res.ok) setRespPlano(res.data);
    else alert(res.erroGeral || 'Erro ao gerar plano de estudo.');
  }

  async function handleRefinar() {
    if (!textoInicial.trim()) {
      alert('Cole ou escreva o texto que você quer refinar.');
      return;
    }
    setLoadingRefinar(true);
    const res = await refinarResultadoService(
      tipoConteudo,
      textoInicial,
      tom,
      tamanho,
    );
    setLoadingRefinar(false);
    if (res.ok) setRespRefinar(res.data);
    else alert(res.erroGeral || 'Erro ao refinar texto.');
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. Explicar tarefa */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Mentor – Explicar tarefa</Text>
          <Text style={styles.sectionSubtitle}>
            Descreva uma tarefa e o mentor gera um plano com IA indicada, passos, dificuldade e tempo estimado.
          </Text>

          <TextInput
            placeholder="Ex: criar um post sobre IA para o LinkedIn..."
            placeholderTextColor={theme.colors.subtext}
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
            multiline
          />

          <Pressable style={styles.button} onPress={handleExplicar} disabled={loadingExplicar}>
            {loadingExplicar ? (
              <ActivityIndicator color={theme.colors.primaryText} />
            ) : (
              <Text style={styles.buttonText}>
                {respExplicar ? 'Gerar outra sugestão' : 'Gerar plano da tarefa'}
              </Text>
            )}
          </Pressable>

          {respExplicar && (
            <View style={styles.responseCard}>
              <View style={styles.responseHeaderRow}>
                <Text style={styles.responseTitle}>Sugestão do mentor</Text>
                <Pressable onPress={() => setRespExplicar(null)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Fechar resposta</Text>
                </Pressable>
              </View>

              <Text style={styles.label}>IA indicada</Text>
              <Text style={styles.text}>{respExplicar.ia_indicada}</Text>

              <Text style={styles.label}>Quando usar</Text>
              <Text style={styles.text}>{respExplicar.quando_usar}</Text>

              <Text style={styles.label}>Quando evitar</Text>
              <Text style={styles.text}>{respExplicar.quando_evitar}</Text>

              <Text style={styles.label}>Passos (humano)</Text>
              <Text style={styles.text}>{respExplicar.passos_humano.join(' · ')}</Text>

              <Text style={styles.label}>Passos (com IA)</Text>
              <Text style={styles.text}>{respExplicar.passos_com_ia.join(' · ')}</Text>

              <View style={styles.tagRow}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Dificuldade: {respExplicar.dificuldade}</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    Tempo estimado: {respExplicar.tempo_estimado_min} min
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* 2. Plano de estudo */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Mentor – Plano de estudo</Text>
          <Text style={styles.sectionSubtitle}>
            Informe um objetivo e quantas horas por semana você tem. A IA gera um plano de estudo em semanas.
          </Text>

          <TextInput
            placeholder="Ex: aprender IA para marketing digital..."
            placeholderTextColor={theme.colors.subtext}
            style={styles.input}
            value={objetivo}
            onChangeText={setObjetivo}
            multiline
          />

          <View style={[styles.row, { marginBottom: 8 }]}>
            <View style={styles.inputSmall}>
              <Text style={styles.label}>Horas por semana</Text>
              <TextInput
                placeholder="4"
                placeholderTextColor={theme.colors.subtext}
                style={styles.input}
                value={horasSemana}
                onChangeText={setHorasSemana}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Pressable style={styles.button} onPress={handlePlano} disabled={loadingPlano}>
            {loadingPlano ? (
              <ActivityIndicator color={theme.colors.primaryText} />
            ) : (
              <Text style={styles.buttonText}>
                {respPlano ? 'Gerar outro plano' : 'Gerar plano de estudo'}
              </Text>
            )}
          </Pressable>

          {respPlano && (
            <View style={styles.responseCard}>
              <View style={styles.responseHeaderRow}>
                <Text style={styles.responseTitle}>Plano sugerido</Text>
                <Pressable onPress={() => setRespPlano(null)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Fechar resposta</Text>
                </Pressable>
              </View>

              <Text style={styles.label}>Objetivo</Text>
              <Text style={styles.text}>{respPlano.objetivo}</Text>

              <Text style={styles.label}>
                Duração: {respPlano.duracao_semanas} semana(s)
              </Text>

              {respPlano.semanas?.map((sem) => (
                <View key={sem.semana} style={{ marginTop: 8 }}>
                  <Text style={styles.label}>
                    Semana {sem.semana} – {sem.foco}
                  </Text>
                  <Text style={styles.text}>Temas: {sem.temas.join(', ')}</Text>
                  <Text style={styles.text}>Tarefas: {sem.tarefas.join(' · ')}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 3. Refinar resultado */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Mentor – Refinar texto</Text>
          <Text style={styles.sectionSubtitle}>
            Cole um texto e peça para a IA refinar com o tom e tamanho desejados.
          </Text>

          <Text style={styles.label}>Tipo de conteúdo</Text>
          <TextInput
            placeholder="post_linkedin, email, roteiro_video..."
            placeholderTextColor={theme.colors.subtext}
            style={styles.input}
            value={tipoConteudo}
            onChangeText={setTipoConteudo}
          />

          <Text style={styles.label}>Tom</Text>
          <TextInput
            placeholder="profissional, informal, didático..."
            placeholderTextColor={theme.colors.subtext}
            style={styles.input}
            value={tom}
            onChangeText={setTom}
          />

          <Text style={styles.label}>Tamanho</Text>
          <TextInput
            placeholder="curto, medio, longo..."
            placeholderTextColor={theme.colors.subtext}
            style={styles.input}
            value={tamanho}
            onChangeText={setTamanho}
          />

          <Text style={styles.label}>Texto inicial</Text>
          <TextInput
            placeholder="Cole aqui o texto que você quer melhorar..."
            placeholderTextColor={theme.colors.subtext}
            style={[styles.input, { minHeight: 100 }]}
            value={textoInicial}
            onChangeText={setTextoInicial}
            multiline
          />

          <Pressable style={styles.button} onPress={handleRefinar} disabled={loadingRefinar}>
            {loadingRefinar ? (
              <ActivityIndicator color={theme.colors.primaryText} />
            ) : (
              <Text style={styles.buttonText}>
                {respRefinar ? 'Gerar outra versão' : 'Refinar texto com IA'}
              </Text>
            )}
          </Pressable>

          {respRefinar && (
            <View style={styles.responseCard}>
              <View style={styles.responseHeaderRow}>
                <Text style={styles.responseTitle}>Versão refinada</Text>
                <Pressable onPress={() => setRespRefinar(null)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Fechar resposta</Text>
                </Pressable>
              </View>

              <Text style={styles.label}>Texto refinado</Text>
              <Text style={styles.text}>{respRefinar.texto_refinado}</Text>

              <Text style={styles.label}>O que foi melhorado</Text>
              <Text style={styles.text}>{respRefinar.explicacao_melhorias}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MentorScreen;
