import { useState, useEffect } from 'react';

interface Props { isDark: boolean; }

export function GreekSection({ isDark }: Props) {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'resources' | 'prompts'>('overview');

  // Save reading position
  useEffect(() => {
    const tabLabels: Record<string, string> = {
      overview: 'Visão Geral',
      curriculum: 'Currículo 5 Níveis',
      resources: 'Recursos',
      prompts: 'Prompts de IA',
    };
    try {
      localStorage.setItem('osa-reading-position', JSON.stringify({
        section: 'greek',
        label: `Grego — ${tabLabels[activeTab] || activeTab}`,
      }));
    } catch { /* ignore */ }
  }, [activeTab]);

  const surface = isDark ? 'bg-dark-surface' : 'bg-surface';
  const textSec = isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary';
  const border = isDark ? 'border-white/10' : 'border-gold/20';

  const tabs = [
    { id: 'overview' as const, label: 'Visão Geral' },
    { id: 'curriculum' as const, label: 'Currículo 5 Níveis' },
    { id: 'resources' as const, label: 'Recursos' },
    { id: 'prompts' as const, label: 'Prompts IA' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 md:ml-60" id="grk-portal">
      {/* Header */}
      <header className="mb-8">
        <p className="script-greek text-2xl mb-3 text-center" lang="grc">Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν</p>
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Grego Koiné
        </h1>
        <p className={`text-center ${textSec} max-w-2xl mx-auto`}>
          Do alfabeto à sintaxe exegética de Wallace. Currículo progressivo para leitura e análise do Novo Testamento grego.
        </p>
        <p className={`text-center text-sm mt-2 ${textSec}`}>
          Curadoria: <strong>Rogério Ramão Lopes</strong> · Setembro de 2026
        </p>
      </header>

      {/* Tabs */}
      <nav className={`flex overflow-x-auto gap-1 mb-6 pb-2 border-b ${border}`} aria-label="Subseções de Grego">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-t-lg text-sm font-medium min-h-[44px] transition-colors ${
              activeTab === tab.id
                ? isDark ? 'bg-gold/20 text-gold' : 'bg-greek/10 text-greek'
                : `${textSec} hover:text-current`
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <section className={`p-5 rounded-xl ${surface}`}>
            <h2 className="text-lg font-bold mb-3">Propósito</h2>
            <p className={textSec}>
              Capacitar você a ler e analisar morfológica e sintaticamente o texto do Novo Testamento grego. Nosso objetivo é destravar as declinações gregas, o sistema de particípios e a complexa sintaxe dos casos nominais.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-paper'}`}>
                <div className="text-2xl font-bold text-portal">25</div>
                <div className={`text-xs ${textSec}`}>Métodos Analisados</div>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-paper'}`}>
                <div className="text-2xl font-bold text-portal">Foco</div>
                <div className={`text-xs ${textSec}`}>Morfologia + Sintaxe Exegética</div>
              </div>
              <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-paper'}`}>
                <div className="text-2xl font-bold text-portal">60min</div>
                <div className={`text-xs ${textSec}`}>Rotina Diária Recomendada</div>
              </div>
            </div>
          </section>

          <section className={`p-5 rounded-xl ${surface}`}>
            <h2 className="text-lg font-bold mb-3">Livros Centrais</h2>
            <div className="space-y-3">
              <div className={`p-4 rounded-lg border ${border}`}>
                <h3 className="font-bold text-sm">"Noções do Grego Bíblico" — Lourenço Stelio Rega</h3>
                <p className={`text-xs ${textSec} mt-1`}>Vida Nova · Nível 2-3</p>
                <p className={`text-sm mt-2 ${textSec}`}>Essencial para o estudante brasileiro. Didática indutiva, livre de jargões complexos, com foco em morfologia nominal e declinações de 1ª, 2ª e 3ª classes.</p>
              </div>
              <div className={`p-4 rounded-lg border ${border}`}>
                <h3 className="font-bold text-sm">"Fundamentos do Grego Bíblico" — William D. Mounce</h3>
                <p className={`text-xs ${textSec} mt-1`}>Vida Nova · Nível 2-3</p>
                <p className={`text-sm mt-2 ${textSec}`}>Padrão global no ensino de grego. Excelente para a morfologia de famílias de palavras, memorização lógica por radicais verbais e deques de alta frequência.</p>
              </div>
              <div className={`p-4 rounded-lg border ${border}`}>
                <h3 className="font-bold text-sm">"Gramática Grega: Sintaxe Exegética" — Daniel B. Wallace</h3>
                <p className={`text-xs ${textSec} mt-1`}>Batista Regular · Nível 4-5</p>
                <p className={`text-sm mt-2 ${textSec}`}>A bíblia exegética de nível intermediário e avançado. Explica como a sintaxe dos artigos, preposições e casos nominais altera e fundamenta a exegese teológica correta.</p>
              </div>
            </div>
          </section>

          <section className={`p-5 rounded-xl ${surface}`}>
            <h2 className="text-lg font-bold mb-3">Mounce vs. Wallace: A Diferença Crucial</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-paper'}`}>
                <h3 className="font-semibold text-sm mb-2">Mounce / Rega — Morfologia</h3>
                <p className={`text-sm ${textSec}`}>Responde ao <em>"O que é"</em>. Ensina desinências, declinações, classificação de tempos verbais. Excelente para as semanas 1-20 (Nível 1-3).</p>
              </div>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-white/5' : 'bg-paper'}`}>
                <h3 className="font-semibold text-sm mb-2">Wallace — Sintaxe Exegética</h3>
                <p className={`text-sm ${textSec}`}>Responde ao <em>"Por que importa teologicamente"</em>. Explica o impacto exegético de um aoristo ingressivo ou um genitivo de posse. Ideal para semanas 21+ (Nível 4-5).</p>
              </div>
            </div>
          </section>

          <section className={`p-5 rounded-xl ${surface}`}>
            <h2 className="text-lg font-bold mb-3">Método Vencedor: Híbrido Integrado (9.8/10)</h2>
            <p className={`${textSec} mb-3`}>Ciclo perfeito de aprendizagem usando Rega + Mounce + Wallace + IA:</p>
            <ol className={`space-y-2 text-sm ${textSec}`}>
              <li><strong>1. Fundação Nominal:</strong> Morfologia com Rega — declinações e desinências iniciais.</li>
              <li><strong>2. Consolidação de Sintaxe:</strong> Conexão com Wallace — peso teológico dos casos e tempos verbais.</li>
              <li><strong>3. Frequência de Vocabulário:</strong> Lógica de Mounce — memorização por frequência do NT.</li>
              <li><strong>4. Validação com IA:</strong> Notebook Gemini como mentor exegético virtual.</li>
            </ol>
          </section>

          <section className={`p-5 rounded-xl ${surface}`}>
            <h2 className="text-lg font-bold mb-3">Ranking de Eficácia</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={isDark ? 'border-b border-white/10' : 'border-b border-gold/20'}>
                    <th className="text-left py-2 px-2 font-semibold">Pos</th>
                    <th className="text-left py-2 px-2 font-semibold">Metodologia</th>
                    <th className="text-left py-2 px-2 font-semibold">Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((r, i) => (
                    <tr key={i} className={isDark ? 'border-b border-white/5' : 'border-b border-gold/10'}>
                      <td className="py-2 px-2 font-bold">{r.pos}º</td>
                      <td className={`py-2 px-2 ${textSec}`}>{r.name}</td>
                      <td className="py-2 px-2 font-semibold text-portal">{r.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Curriculum */}
      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          <p className={textSec}>Plano de 56 semanas (~13 meses) focado em 60 min/dia. Caminho econômico: R$ 0.</p>
          {levels.map((level, i) => (
            <div key={i} className={`rounded-xl border ${border} overflow-hidden`}>
              <button
                onClick={() => setExpandedLevel(expandedLevel === i ? null : i)}
                className={`w-full text-left p-4 flex items-center justify-between min-h-[56px] ${isDark ? 'hover:bg-white/5' : 'hover:bg-surface'} transition-colors`}
                aria-expanded={expandedLevel === i}
              >
                <div>
                  <span className="font-bold">{level.title}</span>
                  <span className={`block text-xs ${textSec}`}>{level.duration} · {level.objective}</span>
                </div>
                <span aria-hidden="true" className={`transition-transform flex-shrink-0 ml-2 ${expandedLevel === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {expandedLevel === i && (
                <div className={`px-4 pb-4 border-t ${border}`}>
                  <div className="mt-3 space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Objetivos:</h4>
                      <ul className={`text-sm space-y-1 ${textSec}`}>
                        {level.objectives.map((o, j) => <li key={j}>• {o}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Estratégias:</h4>
                      <ul className={`text-sm space-y-1 ${textSec}`}>
                        {level.strategies.map((s, j) => <li key={j}>• {s}</li>)}
                      </ul>
                    </div>
                    {level.checkpoint && (
                      <div className={`p-3 rounded-lg ${isDark ? 'bg-gold/10' : 'bg-gold/5'}`}>
                        <h4 className="font-semibold text-sm mb-1">✓ Checkpoint Final:</h4>
                        <ul className={`text-sm space-y-1 ${textSec}`}>
                          {level.checkpoint.map((c, j) => <li key={j}>• {c}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Resources */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-bold mb-3">Recursos Gratuitos Essenciais</h2>
            <div className="space-y-2">
              {freeResources.map((r, i) => (
                <div key={i} className={`p-3 rounded-lg border ${border} flex items-start gap-3`}>
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-greek text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <div className="min-w-0">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium text-sm hover:underline">{r.name}</a>
                    <p className={`text-xs ${textSec}`}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">Obras e Softwares</h2>
            <div className="space-y-3">
              <div className={`p-4 rounded-xl ${surface}`}>
                <h3 className="font-semibold text-sm mb-2">Morfologia Básica (R$ 80-150)</h3>
                <p className={`text-sm ${textSec}`}>"Noções do grego bíblico" — Lourenço Stelio Rega. Essencial para se alfabetizar sem medo, entender declinações de 1ª, 2ª e 3ª classes.</p>
              </div>
              <div className={`p-4 rounded-xl ${surface}`}>
                <h3 className="font-semibold text-sm mb-2">Sintaxe Avançada (R$ 250-450)</h3>
                <p className={`text-sm ${textSec}`}>"Gramática grega: Uma sintaxe exegética" — Daniel B. Wallace. O livro mais importante para entender o peso teológico do artigo, preposições e particípios.</p>
              </div>
              <div className={`p-4 rounded-xl ${surface}`}>
                <h3 className="font-semibold text-sm mb-2">Léxicos e Softwares (R$ 900+)</h3>
                <p className={`text-sm ${textSec}`}>Dicionário BDAG (Bauer-Danker). Logos Bible Software e Accordance para pesquisa morfológica imediata.</p>
              </div>
            </div>
          </section>

          <section className={`p-5 rounded-xl ${surface}`}>
            <h2 className="text-lg font-bold mb-3">Dificuldades Comuns e Soluções</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm">❌ O Labirinto de Particípios</h3>
                <p className={`text-sm ${textSec}`}>Classifique sintaticamente: Adjetivo, Adverbial (temporal, causal, concessivo) ou Suplementar. O "Aspecto" guia a ordem temporal.</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">❌ Aspecto Verbal vs Tempo</h3>
                <p className={`text-sm ${textSec}`}>O grego koiné foca no Aspecto Verbal (perspectiva do autor sobre a ação), não no tempo cronológico. Entender o aspecto do Aoristo e Perfeito evita erros exegéticos.</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">❌ Nuances de Casos (ex: Genitivo)</h3>
                <p className={`text-sm ${textSec}`}>Wallace distingue Genitivo Subjetivo (o próprio Cristo exerce fé) de Genitivo Objetivo (Cristo é o objeto da nossa fé). A sintaxe resolve disputas teológicas!</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Prompts */}
      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <p className={textSec}>Prompts mestres para Grego Koiné prontos para copiar e colar.</p>
          {prompts.map((p, i) => (
            <div key={i} className={`p-4 rounded-xl border ${border}`}>
              <h3 className="font-bold text-sm mb-2">{p.title}</h3>
              <pre className={`text-xs p-3 rounded-lg overflow-x-auto whitespace-pre-wrap ${isDark ? 'bg-black/30' : 'bg-surface'}`}>{p.content}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const rankings = [
  { pos: 1, name: 'Método Híbrido Integrado (Rega + Wallace + IA)', score: '9.8/10' },
  { pos: 2, name: 'Sintaxe Exegética Pura (Wallace)', score: '9.3/10' },
  { pos: 3, name: 'Gramática Introdutória Sistemática (Rega)', score: '8.7/10' },
  { pos: 4, name: 'Imersivo Natural (Vídeos/Áudios)', score: '7.5/10' },
];

const levels = [
  { title: 'Nível 1 — Fundação', duration: '8 semanas', objective: 'Alfabeto + ditongos + fonética + 200 palavras', objectives: ['Dominar o alfabeto grego (24 letras) em 2 semanas', 'Reconhecer vogais, ditongos, acentos e espíritos', 'Memorizar 200 palavras mais frequentes do GNT via Anki', 'Identificar artigo definido e conjunções básicas (καί, δέ)', 'Ler João 1:1-5 em voz alta com pronúncia fluida'], strategies: ['Alfabetização em 10 Dias com IA: escrita manual + exercícios fonéticos', 'Ditongos e Pronúncia por Cópia Manual: copiar João 1 em voz alta', 'Notebook Gemini: quizzes de soletração e transliteração'], checkpoint: ['Ler e escrever alfabeto grego em < 30 segundos', 'Reconhecer 200 palavras do NT sem dicionário', 'Identificar espíritos ásperos e ditongos corretamente'] },
  { title: 'Nível 2 — Básico', duration: '12 semanas', objective: 'Sistema Nominal + Presente do Indicativo', objectives: ['Dominar sistema nominal completo (declinações e casos)', 'Compreender uso exegético do artigo grego', 'Aprender três classes de declinação de substantivos', 'Conjugar verbos regulares e εἰμί no Presente', 'Expandir vocabulário para 600 palavras'], strategies: ['Consolidação Nominal com Rega: declinações sequenciais', 'Parsing Ativo de 1João: identificar cada caso e justificar', 'Notebook Gemini: "Tutor de Casos" com termos reais do NT'], checkpoint: ['Identificar substantivos das 3 declinações com 85% de precisão', 'Diferenciar Acusativo (objeto direto) do Dativo (objeto indireto)', 'Vocabulário ativo de 600 palavras'] },
  { title: 'Nível 3 — Intermediário', duration: '16 semanas', objective: 'Sistema Verbal + Particípios e Infinitivos', objectives: ['Dominar sistema verbal completo (todos os tempos no Indicativo)', 'Compreender as três Vozes (Ativa, Média, Passiva) e depoência', 'Dominar morfologia de Particípios e Infinitivos', 'Diferenciar Aspecto Verbal de Tempo Linear', 'Vocabulário de 1.200 palavras'], strategies: ['Segredo dos Radicais Verbais com Mounce: lógica de formação', 'Domínio de Particípios: sufixo -ντ- + declinação', 'Notebook Gemini: "Simulador de Parsing Verbal"'], checkpoint: ['Parsing morfológico de verbos e particípios com 90% de acerto', 'Traduzir 1João completa com uso mínimo de léxicos', 'Diferenciar Aoristo (pontual) do Presente (contínuo)'] },
  { title: 'Nível 4 — Avançado', duration: '20 semanas', objective: 'Sintaxe Exegética de Wallace + Exegese', objectives: ['Dominar Sintaxe Grega Exegética avançada', 'Compreender nuances de disputas clássicas (Wallace)', 'Dominar Aspecto Verbal exegético do Aoristo e Perfeito', 'Conhecimento de crítica textual e parsing avançado', 'Exegeses de Romanos e Gálatas'], strategies: ['Análise Sintática Sistemática de Casos com Wallace', 'Estudo de Casos Teológicos Chaves: Gálatas 2:16, Romanos 3:22', 'Notebook Gemini: "Mentor de Sintaxe Exegética"'], checkpoint: ['Exegese sintática completa de perícope fundamentada em Wallace', 'Identificar genitivo subjetivo/objetivo com fundamentação', 'Vocabulário passivo de 2.500+ termos do GNT'] },
  { title: 'Nível 5 — Fluência', duration: 'Contínuo', objective: 'Leitura fluida + LXX + Pesquisa', objectives: ['Leitura direta de livros inteiros do NT sem dicionários', 'Expandir para Septuaginta e Pais da Igreja', 'Análises acadêmicas de filologia semítica e helenística', 'Ensinar e mentorar novos estudantes'], strategies: ['Leitura Extensiva Diária: 1 capítulo/dia', 'Exegese Comparada: LXX vs Texto Massorético', 'Notebook Gemini: análise de desvios semânticos LXX→MT'], checkpoint: ['Ler 1 capítulo do NT grego em 15 min com compreensão total', 'Identificar background semântico de citações LXX no GNT', 'Ensinar fundamentos morfológicos e sintáticos a novos estudantes'] },
];

const freeResources = [
  { name: 'Daily Dose of Greek', desc: 'Vídeos curtos diários de tradução de versículos pelo Dr. Rob Plummer.', url: 'https://dailydoseofgreek.com/' },
  { name: 'Step Bible', desc: 'Análise interlinear e léxica avançada. Cursor sobre termos mostra raiz e parsing.', url: 'https://stepbible.org/' },
  { name: 'Alpha with Angela', desc: 'Curso em vídeo imersivo natural para vocabulário básico contextualizado.', url: 'https://www.youtube.com/@alpha.with.angela' },
  { name: 'GNT Reader', desc: 'Texto grego com tradução interlinear e glossário flutuante.', url: 'https://gntreader.com/' },
];

const prompts = [
  { title: 'Tutor Pessoal de Grego Koiné', content: 'Você é o meu Tutor Pessoal especialista em Grego Koiné (Bíblico). Seu objetivo é me auxiliar no aprendizado de desinências, declinações, sistema nominal e paradigmas de verbos com base em gramáticas clássicas de morfologia (como Lourenço Stelio Rega) e sintaxe (como Daniel B. Wallace). Sempre responda seguindo:\n1. Resumo gramatical ou explicação da dúvida de forma direta e amigável.\n2. Exemplos no Novo Testamento grego original com parsing e tradução literal.\n3. Desafios de parsing em formato de quiz rápido no final para que eu pratique ativamente.' },
  { title: 'Analista de Sintaxe e Casos Grego (Wallace)', content: 'Atue como um analista morfossemântico e sintático especialista no Grego do Novo Testamento, utilizando a metodologia exegética de Daniel B. Wallace. Eu inserirei uma frase ou versículo em grego, e você deve:\n- Dividir a frase palavra por palavra realizando o parsing morfológico detalhado (Caso, Tempo, Voz, Modo).\n- Analisar a função sintática específica do Artigo Definido no contexto.\n- Determinar a classificação sintática exata dos Casos Nominais envolvidos (ex: Genitivo Subjetivo, Dativo de Meio, Acusativo de Referência).\n- Apresentar as nuances de Tradução e implicações teológicas/exegéticas chaves.' },
];
