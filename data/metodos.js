/**
 * data/metodos.js — 25 métodos reais de aprendizagem de idiomas aplicados às línguas bíblicas.
 * Fonte única: alimenta as tabelas estáticas E os gráficos das páginas Hebraico e Grego.
 * Todos os números 0–10 são ESTIMATIVAS EDITORIAIS do curador (sinalizadas na UI).
 * Campos: nome, foco (tags), grupo (professor|aluno|texto), complexidade (1–10),
 * tempoSemanal (horas estimadas p/ progresso consistente), eficacia (0–10),
 * facilidade (0–10), custo (0–10, maior = mais acessível), sustentabilidade (0–10),
 * aplicacao (0–10 aplicação direta ao texto bíblico).
 */
export const METODOS = [
  { id: 'gram-trad', nome: 'Gramática-tradução', grupo: 'professor', foco: ['morfologia', 'sintaxe'], complexidade: 7, tempoSemanal: 6, eficacia: 7, facilidade: 5, custo: 8, sustentabilidade: 6, aplicacao: 8 },
  { id: 'leitura-direta', nome: 'Leitura direta (target-text)', grupo: 'texto', foco: ['vocabulário', 'fluência'], complexidade: 6, tempoSemanal: 5, eficacia: 8, facilidade: 4, custo: 9, sustentabilidade: 8, aplicacao: 9 },
  { id: 'indutivo', nome: 'Estudo indutivo do texto', grupo: 'texto', foco: ['observação', 'gramática'], complexidade: 5, tempoSemanal: 4, eficacia: 7, facilidade: 7, custo: 9, sustentabilidade: 8, aplicacao: 9 },
  { id: 'tpr-comutativo', nome: 'Abordagem comutativa / TPR', grupo: 'aluno', foco: ['oralidade', 'compreensão'], complexidade: 5, tempoSemanal: 5, eficacia: 7, facilidade: 5, custo: 6, sustentabilidade: 7, aplicacao: 5 },
  { id: 'imersao', nome: 'Imersão (aulas na língua-alvo)', grupo: 'professor', foco: ['oralidade', 'ouvido'], complexidade: 7, tempoSemanal: 8, eficacia: 8, facilidade: 3, custo: 4, sustentabilidade: 5, aplicacao: 6 },
  { id: 'assimil', nome: 'Assimilação (fichas sistemáticas)', grupo: 'aluno', foco: ['reconhecimento', 'padrões'], complexidade: 4, tempoSemanal: 4, eficacia: 6, facilidade: 7, custo: 6, sustentabilidade: 7, aplicacao: 6 },
  { id: 'graded-readers', nome: 'Leituras graduadas (moldagem)', grupo: 'texto', foco: ['vocabulário', 'prazer de ler'], complexidade: 4, tempoSemanal: 4, eficacia: 7, facilidade: 8, custo: 6, sustentabilidade: 8, aplicacao: 7 },
  { id: 'sondagem', nome: 'Sondagem guiada (questioning)', grupo: 'professor', foco: ['análise', 'memorização'], complexidade: 5, tempoSemanal: 4, eficacia: 6, facilidade: 6, custo: 8, sustentabilidade: 6, aplicacao: 7 },
  { id: 'coaching', nome: 'Coaching textual (mentoria 1:1)', grupo: 'professor', foco: ['correção', 'constância'], complexidade: 5, tempoSemanal: 3, eficacia: 8, facilidade: 6, custo: 3, sustentabilidade: 6, aplicacao: 8 },
  { id: 'srs-anki', nome: 'Repetição espaçada (Anki/SRS)', grupo: 'aluno', foco: ['vocabulário', 'retenção'], complexidade: 3, tempoSemanal: 2, eficacia: 8, facilidade: 8, custo: 9, sustentabilidade: 9, aplicacao: 7 },
  { id: 'drill-pattern', nome: 'Drilling de paradigmas e padrões', grupo: 'aluno', foco: ['morfologia', 'automatismo'], complexidade: 5, tempoSemanal: 3, eficacia: 7, facilidade: 5, custo: 9, sustentabilidade: 7, aplicacao: 8 },
  { id: 'trad-reverso', nome: 'Tradução reversa (PT → original)', grupo: 'texto', foco: ['produção', 'sintaxe'], complexidade: 7, tempoSemanal: 4, eficacia: 8, facilidade: 4, custo: 9, sustentabilidade: 7, aplicacao: 9 },
  { id: 'ditado', nome: 'Ditados e cópia manual', grupo: 'aluno', foco: ['alfabeto', 'ortografia/niqqud'], complexidade: 3, tempoSemanal: 2, eficacia: 6, facilidade: 8, custo: 9, sustentabilidade: 7, aplicacao: 6 },
  { id: 'audio-passo', nome: 'Áudio passivo e shadowing', grupo: 'aluno', foco: ['pronúncia', 'ouvido'], complexidade: 3, tempoSemanal: 3, eficacia: 5, facilidade: 8, custo: 8, sustentabilidade: 8, aplicacao: 4 },
  { id: 'analise-sintatica', nome: 'Análise sintática com software (ETCBC/Logos)', grupo: 'texto', foco: ['sintaxe', 'tecnologia'], complexidade: 8, tempoSemanal: 4, eficacia: 8, facilidade: 4, custo: 5, sustentabilidade: 7, aplicacao: 9 },
  { id: 'interlinear', nome: 'Estudo interlinear guiado', grupo: 'texto', foco: ['parsing', 'vocabulário'], complexidade: 4, tempoSemanal: 3, eficacia: 6, facilidade: 8, custo: 9, sustentabilidade: 7, aplicacao: 8 },
  { id: 'parse-arquivo', nome: 'Parsing diário de versículos', grupo: 'texto', foco: ['morfologia', 'rotina'], complexidade: 5, tempoSemanal: 2, eficacia: 7, facilidade: 7, custo: 9, sustentabilidade: 8, aplicacao: 9 },
  { id: 'vocab-frequencia', nome: 'Vocabulário por frequência (listas de palavras mais comuns)', grupo: 'aluno', foco: ['léxico', 'eficiência'], complexidade: 3, tempoSemanal: 2, eficacia: 7, facilidade: 8, custo: 9, sustentabilidade: 8, aplicacao: 8 },
  { id: 'mnemonicos', nome: 'Mnemônicos e palácios de memória', grupo: 'aluno', foco: ['alfabeto', 'paradigmas'], complexidade: 3, tempoSemanal: 1, eficacia: 5, facilidade: 7, custo: 9, sustentabilidade: 7, aplicacao: 5 },
  { id: 'video-curso', nome: 'Vídeo-cursos estruturados (ex.: Aleph with Beth, DDOG)', grupo: 'professor', foco: ['sequência', 'explicação'], complexidade: 4, tempoSemanal: 4, eficacia: 7, facilidade: 8, custo: 8, sustentabilidade: 8, aplicacao: 7 },
  { id: 'comunidades', nome: 'Comunidades de prática e grupos de estudo', grupo: 'aluno', foco: ['motivação', 'troca'], complexidade: 3, tempoSemanal: 3, eficacia: 6, facilidade: 7, custo: 9, sustentabilidade: 8, aplicacao: 5 },
  { id: 'ia-tutoria', nome: 'Tutoria assistida por IA (com salvaguardas)', grupo: 'aluno', foco: ['prática', 'feedback'], complexidade: 5, tempoSemanal: 3, eficacia: 7, facilidade: 8, custo: 7, sustentabilidade: 7, aplicacao: 7 },
  { id: 'exegetico-projeto', nome: 'Projetos exegéticos pequenos (do texto à nota)', grupo: 'texto', foco: ['exegese', 'integração'], complexidade: 8, tempoSemanal: 6, eficacia: 8, facilidade: 4, custo: 7, sustentabilidade: 6, aplicacao: 10 },
  { id: 'cartilha-leitura', nome: 'Cartilha de leitura em voz alta (aliqot/akzya)', grupo: 'professor', foco: ['cantação', 'fluência'], complexidade: 6, tempoSemanal: 3, eficacia: 6, facilidade: 5, custo: 7, sustentabilidade: 6, aplicacao: 7 },
  { id: 'hibrido', nome: 'Integração híbrida (leitura + gramática ativa + SRS + mentoria)', grupo: 'texto', foco: ['integração', 'todas as habilidades'], complexidade: 6, tempoSemanal: 6, eficacia: 9, facilidade: 6, custo: 7, sustentabilidade: 9, aplicacao: 9 },
];

/** Ranking derivado transparentemente da média ponderada dos critérios acima. */
export function ranking() {
  return METODOS
    .map(m => ({ ...m, score: +(m.eficacia * 0.35 + m.aplicacao * 0.3 + m.sustentabilidade * 0.2 + m.facilidade * 0.15).toFixed(2) }))
    .sort((a, b) => b.score - a.score);
}

/** Dados prontos para os 4 gráficos (mesmos valores das tabelas). */
export function chartData() {
  const top = ranking().slice(0, 4);
  return {
    scatter: METODOS.map(m => ({ metodo: m.nome, complexidade: m.complexidade, tempoSemanal: m.tempoSemanal, eficacia: m.eficacia })),
    radarTop: top.map(m => ({ metodo: m.nome, eficacia: m.eficacia, facilidade: m.facilidade, custo: m.custo, sustentabilidade: m.sustentabilidade, aplicacao: m.aplicacao })),
    barrasTempo: [...METODOS].sort((a, b) => a.tempoSemanal - b.tempoSemanal).map(m => ({ metodo: m.nome, tempoSemanal: m.tempoSemanal })),
    comparativo: (() => {
      const h = METODOS.find(m => m.id === 'hibrido');
      const t = METODOS.find(m => m.id === 'gram-trad');
      return { hibrido: [h.eficacia, h.custo, h.facilidade, h.sustentabilidade], tradicional: [t.eficacia, t.custo, t.facilidade, t.sustentabilidade] };
    })(),
  };
}
