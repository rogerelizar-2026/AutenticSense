import { useState, useEffect } from 'react';

interface Props { isDark: boolean; }

export function HebrewSection({ isDark }: Props) {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [expandedMethod, setExpandedMethod] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'methods' | 'curriculum' | 'resources' | 'prompts'>('overview');

  // Save reading position
  useEffect(() => {
    const tabLabels: Record<string, string> = {
      overview: 'Visão Geral',
      methods: 'Métodos de Aprendizado',
      curriculum: 'Currículo 5 Níveis',
      resources: 'Recursos',
      prompts: 'Prompts de IA',
    };
    try {
      localStorage.setItem('osa-reading-position', JSON.stringify({
        section: 'hebrew',
        label: `Hebraico — ${tabLabels[activeTab] || activeTab}`,
      }));
    } catch { /* ignore */ }
  }, [activeTab]);

  const surface = isDark ? 'bg-dark-surface' : 'bg-surface';
  const textSec = isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary';
  const border = isDark ? 'border-white/10' : 'border-gold/20';

  const tabs = [
    { id: 'overview' as const, label: 'Visão Geral' },
    { id: 'methods' as const, label: 'Métodos' },
    { id: 'curriculum' as const, label: 'Currículo 5 Níveis' },
    { id: 'resources' as const, label: 'Recursos' },
    { id: 'prompts' as const, label: 'Prompts IA' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 md:ml-60" id="heb-portal">
      {/* Header */}
      <header className="mb-8">
        <p className="text-hebrew text-2xl mb-3 text-center" lang="he" dir="rtl">בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ</p>
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Hebraico e Aramaico Bíblicos
        </h1>
        <p className={`text-center ${textSec} max-w-2xl mx-auto`}>
          Currículo completo para estudo do Antigo Testamento nos idiomas originais. Inclui Aramaico bíblico (Daniel e Esdras).
        </p>
        <p className={`text-center text-sm mt-2 ${textSec}`}>
          Curadoria: <strong>Rogério Ramão Lopes</strong> · Setembro de 2026
        </p>
      </header>

      {/* Tabs */}
      <nav className={`flex overflow-x-auto gap-1 mb-6 pb-2 border-b ${border}`} aria-label="Subseções de Hebraico">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-t-lg text-sm font-medium min-h-[44px] transition-colors ${
              activeTab === tab.id
                ? isDark ? 'bg-gold/20 text-gold' : 'bg-portal/10 text-portal'
                : `${textSec} hover:text-current`
            }`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <section className={`p-5 rounded-xl ${surface}`}>
            <h2 className="text-lg font-bold mb-3">Estatísticas da Curadoria</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Métodos Analisados" value="25" isDark={isDark} />
              <Stat label="Recursos Mapeados" value="60+" isDark={isDark} />
              <Stat label="Recursos Gratuitos" value="30" isDark={isDark} />
              <Stat label="Recursos Pagos" value="31" isDark={isDark} />
            </div>
          </section>

          <section className={`p-5 rounded-xl ${surface}`}>
            <h2 className="text-lg font-bold mb-3">Método Vencedor: Híbrido/Multimodal (9.8/10)</h2>
            <p className={`${textSec} mb-3`}>
              Combina gramática estruturada com imersão comunicativa, repetição espaçada (SRS) para vocabulário e leitura extensiva para fluência. Avança 3x mais rápido que métodos únicos.
            </p>
            <h3 className="font-semibold mb-2">Princípios Fundamentais:</h3>
            <ul className={`space-y-1 ${textSec} text-sm`}>
              <li>• <strong>Intencionalidade:</strong> Cada método para um objetivo específico</li>
              <li>• <strong>Progressão:</strong> Métodos complementam-se em fases sequenciais</li>
              <li>• <strong>Personalização:</strong> Ajuste conforme perfil e tempo disponível</li>
              <li>• <strong>Consistência:</strong> 30-60 min/dia &gt; sessões longas esporádicas</li>
              <li>• <strong>Input + Output:</strong> Recepção + produção (leitura, fala, parsing)</li>
            </ul>
          </section>

          <section className={`p-5 rounded-xl ${surface}`}>
            <h2 className="text-lg font-bold mb-3">Livros de Referência</h2>
            <div className="space-y-4">
              <BookCard title='"Gramática do Hebraico Bíblico"' author="Allen P. Ross" publisher="Vida" level="Nível 1-3" focus="Método clássico: linguística moderna + tradições filológicas. Excelente para alefato, niqqud, estado construto e stems básicos." isDark={isDark} />
            </div>
          </section>

          <section className={`p-5 rounded-xl ${surface}`}>
            <h2 className="text-lg font-bold mb-3">Apps Recomendados</h2>
            <div className="space-y-3">
              <AppCard name="Sofia App" desc="Ferramenta técnica, limpa, 100% livre de propagandas. Strong + GK Codes + Louw-Nida." isDark={isDark} />
              <AppCard name="Ginoskos" desc="Gramática dinâmica, SRS, vocabulário ativo. Hebraico, Grego, Aramaico, Latim, Siríaco." isDark={isDark} />
              <AppCard name="Global Bible Tools" desc="100% gratuito e sem anúncios. Áudio sincronizado, dicionário em 1 toque, suporte offline." isDark={isDark} />
            </div>
          </section>

          <section className={`p-5 rounded-xl ${surface}`}>
            <h2 className="text-lg font-bold mb-3">Metodologia de Aceleração com IA (Notebook Gemini)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <LevelCard level="Níveis 1-2" title="Ditados e Parsing Reverso" desc="Exercícios de reconhecimento fonético e parsing reverso usando versículos de Gênesis 1." isDark={isDark} />
              <LevelCard level="Nível 3" title="Morfologia e Desvios" desc="Identificar padrões e desvios de verbos fracos ou laringais, particípios no grego." isDark={isDark} />
              <LevelCard level="Níveis 4-5" title="Co-Mentoria Exegética" desc="Método S.O.I.A. para debater variantes textuais, significados e comparar LXX com Texto Massorético." isDark={isDark} />
            </div>
          </section>
        </div>
      )}

      {/* Methods Tab */}
      {activeTab === 'methods' && (
        <div className="space-y-4">
          <p className={textSec}>25 métodos analisados pela curadoria. Os 10 primeiros compõem o currículo prático.</p>
          <div className="space-y-2">
            {methods.map((m, i) => (
              <div key={i} className={`rounded-xl border ${border} overflow-hidden`}>
                <button
                  onClick={() => setExpandedMethod(expandedMethod === i ? null : i)}
                  className={`w-full text-left p-4 flex items-center justify-between min-h-[56px] ${isDark ? 'hover:bg-white/5' : 'hover:bg-surface'} transition-colors`}
                  aria-expanded={expandedMethod === i}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < 3 ? 'bg-gold text-white' : isDark ? 'bg-white/10' : 'bg-surface'}`}>{i + 1}</span>
                    <span className="font-medium text-sm truncate">{m.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-white/10' : 'bg-surface'}`}>{m.note}</span>
                    <span aria-hidden="true" className={`transition-transform ${expandedMethod === i ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>
                {expandedMethod === i && (
                  <div className={`px-4 pb-4 ${textSec} text-sm border-t ${border}`}>
                    <p className="mt-3"><strong>Didática:</strong> {m.didatica}</p>
                    {m.exemplos && <p className="mt-2"><strong>Exemplos:</strong> {m.exemplos}</p>}
                    {m.tempo && <p className="mt-2"><strong>Tempo estimado:</strong> {m.tempo}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curriculum Tab */}
      {activeTab === 'curriculum' && (
        <div className="space-y-4">
          <p className={textSec}>Plano de 56 semanas (~13 meses) para leitura autônoma do AT. Caminho econômico: R$ 0. Carga: 60 min/dia.</p>
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

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-bold mb-3">Recursos Gratuitos Fundamentais</h2>
            <p className={`text-sm ${textSec} mb-3`}>💡 Dica: Comece pelos recursos de complexidade 1 a 3. Não use ETCBC ou CAL antes de dominar o alefato.</p>
            <div className="space-y-2">
              {freeResources.map((r, i) => (
                <div key={i} className={`p-3 rounded-lg border ${border} flex items-start gap-3`}>
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-portal text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <div className="min-w-0">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="font-medium text-sm hover:underline">{r.name}</a>
                    <p className={`text-xs ${textSec}`}>{r.type} · Complexidade: {r.complexity}/10</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">Recursos Pagos por Nível</h2>
            <div className="space-y-4">
              {paidTiers.map((tier, i) => (
                <div key={i} className={`p-4 rounded-xl ${surface}`}>
                  <h3 className="font-semibold mb-2">{tier.title}</h3>
                  <div className="space-y-2">
                    {tier.items.map((item, j) => (
                      <div key={j} className={`text-sm ${textSec}`}>
                        <span className="font-medium">{item.name}</span> — {item.price}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3">Instituições Recomendadas no Brasil</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={isDark ? 'border-b border-white/10' : 'border-b border-gold/20'}>
                    <th className="text-left py-2 px-3 font-semibold">Instituição</th>
                    <th className="text-left py-2 px-3 font-semibold">UF</th>
                  </tr>
                </thead>
                <tbody>
                  {institutions.map((inst, i) => (
                    <tr key={i} className={isDark ? 'border-b border-white/5' : 'border-b border-gold/10'}>
                      <td className="py-2 px-3"><a href={inst.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{inst.name}</a></td>
                      <td className={`py-2 px-3 ${textSec}`}>{inst.uf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Prompts Tab */}
      {activeTab === 'prompts' && (
        <div className="space-y-4">
          <p className={textSec}>Prompts mestres calibrados para transformar ChatGPT, Claude ou Qwen em mentores virtuais de Hebraico e Aramaico.</p>
          {prompts.map((p, i) => (
            <div key={i} className={`p-4 rounded-xl border ${border}`}>
              <h3 className="font-bold text-sm mb-2">Prompt {i + 1}: {p.title}</h3>
              <pre className={`text-xs p-3 rounded-lg overflow-x-auto whitespace-pre-wrap ${isDark ? 'bg-black/30' : 'bg-surface'}`}>{p.content}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div className={`text-center p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-paper'}`}>
      <div className="text-2xl font-bold text-portal">{value}</div>
      <div className={`text-xs ${isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'}`}>{label}</div>
    </div>
  );
}

function BookCard({ title, author, publisher, level, focus, isDark }: { title: string; author: string; publisher: string; level: string; focus: string; isDark: boolean }) {
  return (
    <div className={`p-4 rounded-lg border ${isDark ? 'border-white/10' : 'border-gold/20'}`}>
      <h3 className="font-bold text-sm">{title}</h3>
      <p className={`text-xs ${isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'}`}>{author} · {publisher} · {level}</p>
      <p className={`text-sm mt-1 ${isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'}`}>{focus}</p>
    </div>
  );
}

function AppCard({ name, desc, isDark }: { name: string; desc: string; isDark: boolean }) {
  return (
    <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-paper'}`}>
      <h4 className="font-semibold text-sm">{name}</h4>
      <p className={`text-xs ${isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'}`}>{desc}</p>
    </div>
  );
}

function LevelCard({ level, title, desc, isDark }: { level: string; title: string; desc: string; isDark: boolean }) {
  return (
    <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-paper'}`}>
      <span className={`text-xs font-semibold ${isDark ? 'text-gold' : 'text-portal'}`}>{level}</span>
      <h4 className="font-semibold text-sm mt-1">{title}</h4>
      <p className={`text-xs ${isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'}`}>{desc}</p>
    </div>
  );
}

const methods = [
  { name: 'Método Híbrido/Multimodal Integrado', note: '9.8/10', didatica: 'Combina intencionalmente múltiplos métodos em um sistema coerente. Aulas comunicativas + SRS para vocabulário + leitura extensiva + parsing semanal + tutoria mensal.', exemplos: 'Programas personalizados, "DIY curriculum" com orientação', tempo: '6-12 meses (intensivo e bem planejado)' },
  { name: 'Imersão Comunicativa', note: '9.5/10', didatica: 'Todas as instruções em hebraico desde o primeiro dia. Usa TPR, imagens, gestos e contextos para transmitir significado sem tradução.', exemplos: 'Aleph with Beth, Biblical Language Center', tempo: '3-8 meses (intensivo)' },
  { name: 'Leitura Direta (Reading-First)', note: '9.2/10', didatica: 'O aluno começa a ler textos bíblicos desde o início. Textos adaptados com vocabulário frequente e glosas interlineares.', exemplos: '"From Adam to Moses" (Carasik)', tempo: '6-12 meses' },
  { name: 'Tutoria/Mentoria Individual', note: '9.0/10', didatica: 'Aprendizado personalizado com tutor que adapta ritmo, conteúdo e abordagem às necessidades do aluno.', exemplos: 'iTalki, Preply, professores de seminário', tempo: '6-12 meses (intensivo)' },
  { name: 'Gramática-Tradução (Tradicional)', note: '8.5/10', didatica: 'Estudo sistemático da gramática seguido de tradução de textos. Ênfase na análise de cada forma verbal, nominal e preposicional.', exemplos: 'Ross, Pratico & Van Pelt, Lambdin, Seow', tempo: '12-24 meses' },
  { name: 'SRS + Leitura', note: '8.3/10', didatica: 'Algoritmos de repetição espaçada para maximizar retenção de vocabulário e formas gramaticais.', exemplos: 'Anki, Memrise, Quizlet', tempo: 'Contínuo (30min/dia)' },
  { name: 'Curso Universitário/Seminário', note: '8.0/10', didatica: 'Curso formal com carga horária definida, avaliações, créditos acadêmicos. 2-4 semestres de hebraico + 1 de aramaico.', exemplos: 'PTS, Dallas, Trinity, Westminster', tempo: '12-24 meses' },
  { name: 'Indutivo-Gramatical', note: '7.8/10', didatica: 'Combina abordagem indutiva (descoberta de regras) com explicação gramatical estruturada.', exemplos: '"Discovering Biblical Hebrew" (Dawson)', tempo: '12-18 meses' },
  { name: 'Estudo por Pericopes (Parashah)', note: '7.7/10', didatica: 'Baseado na tradição judaica da Parashah. Porção semanal estudada em profundidade.', tempo: 'Contínuo (1 ano = Torá completa)' },
  { name: 'Áudio-Oral (Chanting/Recitation)', note: '7.5/10', didatica: 'Baseado na tradição judaica de recitação e cantilação. Internalização de padrões fonológicos e te\'amim.', tempo: 'Contínuo' },
  { name: 'Parsing/Morfologia', note: '7.3/10', didatica: 'Foco intensivo na identificação e análise de cada forma morfológica no texto.', tempo: '6-12 meses (complemento)' },
  { name: 'Vídeo-Aulas Estruturadas', note: '7.2/10', didatica: 'Curso completo em formato de vídeo com progressão lógica, exercícios e avaliações.', exemplos: 'Michael Carasik (Coursera)', tempo: '8-16 meses' },
  { name: 'Estudo por Raízes (Root-Based)', note: '7.0/10', didatica: 'Organiza aprendizado em torno das raízes triliterais. Para cada raiz, estuda todas as formas derivadas.', tempo: '12-18 meses' },
  { name: 'Aprendizagem por Padrões', note: '6.8/10', didatica: 'Foca na identificação de padrões recorrentes antes de estudar regras gramaticais formais.', tempo: '8-14 meses' },
  { name: 'Análise Discursiva', note: '6.7/10', didatica: 'Estuda como o texto funciona em nível discursivo: estrutura da informação, tópico/foco, coerência textual.', tempo: 'Requer base prévia + 6-12 meses' },
  { name: 'Software/Análise Computacional', note: '6.5/10', didatica: 'Softwares especializados para estudo com ferramentas de busca, análise morfológica e sintaxe anotada.', tempo: 'Contínuo' },
  { name: 'Estudo Interlinear', note: '6.3/10', didatica: 'Textos interlineares como ferramenta principal com tradução palavra por palavra.', tempo: '12-24 meses' },
  { name: 'Podcast/Audiocurso', note: '6.0/10', didatica: 'Episódios de áudio que ensinam conceitos de forma progressiva.', tempo: '12-24 meses (complemento)' },
  { name: 'Memorização de Texto Bíblico', note: '5.8/10', didatica: 'Memorização de porções significativas do texto bíblico em hebraico.', tempo: 'Contínuo' },
  { name: 'Estudo em Grupo/Comunidade', note: '5.5/10', didatica: 'Aprendizado colaborativo em grupo com discussão de textos e prática mútua.', tempo: 'Contínuo' },
  { name: 'Campos Semânticos', note: '5.3/10', didatica: 'Vocabulário organizado por campos semânticos em vez de frequência ou ordem alfabética.', tempo: '12-18 meses' },
  { name: 'Gamificação', note: '5.0/10', didatica: 'Elementos de jogos para motivar o aprendizado de gramática e vocabulário.', tempo: 'Contínuo' },
  { name: 'Natural/Linguista (Nave)', note: '4.8/10', didatica: 'Análise de cada ocorrência de cada palavra no texto bíblico.', tempo: '18-36 meses' },
  { name: 'Comparativo-Semítico', note: '4.5/10', didatica: 'Hebraico bíblico em comparação com outras línguas semíticas.', tempo: '18-36 meses' },
  { name: 'Transliteração Progressiva', note: '4.0/10', didatica: 'Texto hebraico com transliteração gradualmente removida.', tempo: '12-18 meses' },
];

const levels = [
  { title: 'Nível 1 — Fundação', duration: '8 semanas', objective: 'Alefato + 200 palavras + leitura básica', objectives: ['Dominar o alefato (22 consoantes + 5 finais) em 2 semanas', 'Ler palavras com niqqud (vogais) com precisão', 'Memorizar 200 palavras de alta frequência', 'Reconhecer artigos, preposições básicas e conjunções', 'Ler Gênesis 1:1-5 com compreensão básica'], strategies: ['Alefato em 14 Dias com IA: vídeos + escrita + Anki', 'Vocabulário com SRS + IA: 20 palavras novas/dia', 'Input Compreensível: Sefaria + traduções por IA'], checkpoint: ['Ler alefato completo em < 30 segundos', 'Reconhecer 200 palavras sem dicionário', 'Ler Gênesis 1:1-5 em voz alta com pronúncia correta', 'Identificar artigo הַ, preposições בְּ, לְ, כְּ e conjunção וְ'] },
  { title: 'Nível 2 — Básico', duration: '12 semanas', objective: 'Gramática essencial + textos simples', objectives: ['Dominar substantivos (gênero, número, estado construto)', 'Conjugar verbos Qal perfeito e imperfeito', 'Ampliar vocabulário para 600 palavras', 'Ler narrativas simples (Gênesis 1-3, Jonas 1)', 'Usar dicionário online (BDB, HALOT digital)'], strategies: ['Gramática Indutiva com IA: análise de padrões em Jonas 1', 'Parsing Diário com Feedback IA: 5 verbos/dia', 'Leitura em Voz Alta + Gravação: 15 min diários'], checkpoint: ['Conjugar verbos Qal com 90% de precisão', 'Identificar estado construto e absoluto', 'Vocabulário ativo de 600 palavras', 'Ler Jonas 1 com 70% de compreensão sem dicionário'] },
  { title: 'Nível 3 — Intermediário', duration: '16 semanas', objective: 'Leitura autônoma + morfologia verbal', objectives: ['Dominar todos os 7 stems verbais', 'Compreender sintaxe básica e waw consecutivo', 'Vocabulário de 1.200 palavras', 'Ler porções da Torá com auxílio mínimo', 'Iniciar aramaico bíblico (Daniel 2-7, Esdras 4-7)'], strategies: ['Estudo por Pericopes (Parashah) com IA', 'Análise de Raízes com IA: organização por raízes triliterais', 'Imersão em Aramaico com IA: CAL + tradução'], checkpoint: ['Identificar e conjugar todos os 7 stems verbais', 'Compreender waw consecutivo e sintaxe narrativa', 'Vocabulário de 1.200 palavras (100 raízes principais)', 'Ler Daniel 2 em aramaico com auxílio de CAL + IA'] },
  { title: 'Nível 4 — Avançado', duration: '20 semanas', objective: 'Texto bíblico completo + exegese', objectives: ['Leitura autônoma de todo o AT hebraico', 'Análise discursiva e retórica do texto', 'Vocabulário de 2.500+ palavras', 'Domínio de aramaico bíblico', 'Capacidade de exegese básica do texto original'], strategies: ['Leitura Extensiva Diária com IA: 1 capítulo/dia', 'Exegese Semanal com IA: perícope completa', 'Análise Discursiva com IA: Levinsohn traduzido'], checkpoint: ['Ler qualquer capítulo do AT com 90%+ de compreensão', 'Fazer exegese básica sem auxílio externo', 'Vocabulário passivo de 2.500+ palavras', 'Usar BDB, HALOT digital e CAL com proficiência'] },
  { title: 'Nível 5 — Fluência', duration: 'Contínuo', objective: 'Leitura fluida + aramaico + pesquisa', objectives: ['Leitura fluida e natural do AT', 'Pesquisa acadêmica independente', 'Domínio de linguística semítica comparada', 'Capacidade de ensino/mentoria', 'Contribuição para a comunidade de estudos'], strategies: ['Leitura como Hábito de Vida: AT completo a cada 2 anos', 'Pesquisa e Produção de Conteúdo com IA', 'Mentoria e Ensino com IA'], checkpoint: ['Ler 1 capítulo do AT em 15-20 minutos com compreensão total', 'Traduzir textos desconhecidos com precisão acadêmica', 'Ensinar hebraico bíblico a iniciantes com confiança'] },
];

const freeResources = [
  { name: 'Duolingo (Hebraico Moderno - Base)', type: 'App / Web', complexity: 1, url: 'https://www.duolingo.com/' },
  { name: 'Aleph with Beth (YouTube)', type: 'Vídeo-aula', complexity: 1.5, url: 'https://www.youtube.com/@alephwithbeth' },
  { name: 'Sefaria.org', type: 'Biblioteca Digital', complexity: 2, url: 'https://www.sefaria.org/' },
  { name: 'Bible Hub (Interlinear)', type: 'Ferramenta de Estudo', complexity: 2.2, url: 'https://biblehub.com/interlinear' },
  { name: 'Blue Letter Bible', type: 'Concordância / Léxico', complexity: 2.5, url: 'https://www.blueletterbible.org/' },
  { name: 'Anki (Decks de Hebraico Bíblico)', type: 'SRS / Flashcards', complexity: 2.8, url: 'https://apps.ankiweb.net/' },
  { name: 'Coursera - "Biblical Hebrew" (Carasik)', type: 'Curso Online', complexity: 4, url: 'https://www.coursera.org/learn/biblical-hebrew' },
  { name: 'ETCBC (SHEBANQ)', type: 'Base de Dados Sintática', complexity: 5, url: 'https://etcbc.org/' },
  { name: 'CAL (Comprehensive Aramaic Lexicon)', type: 'Léxico de Aramaico', complexity: 6.5, url: 'https://cal.huc.edu/' },
];

const paidTiers = [
  { title: 'Nível BAIXO (1-3/10) — R$ 80-250', items: [
    { name: '"Teach Yourself Complete Biblical Hebrew"', price: 'R$ 80-120' },
    { name: '"First Hebrew Primer" (Simon et al.)', price: 'R$ 100-150' },
    { name: '"Gramática do Hebraico Bíblico" — Ross ⭐', price: 'R$ 120-180' },
    { name: '"Basics of Biblical Hebrew" (Pratico & Van Pelt)', price: 'R$ 150-250' },
  ]},
  { title: 'Nível MÉDIO (3-6/10) — R$ 100-500', items: [
    { name: '"Introduction to Biblical Hebrew" (Lambdin)', price: 'R$ 100-160' },
    { name: '"Grammar of Biblical Aramaic" (Rosenthal)', price: 'R$ 180-280' },
    { name: 'Tutoria Online (iTalki/Preply)', price: 'R$ 50-200/hora' },
  ]},
  { title: 'Nível ALTO (6-8/10) — R$ 500-8.000+', items: [
    { name: 'Accordance Bible Software', price: 'R$ 500-5.000+' },
    { name: 'Logos Bible Software', price: 'R$ 800-8.000+' },
    { name: '"HALOT" (Koehler & Baumgartner)', price: 'R$ 1.500-3.000' },
  ]},
];

const institutions = [
  { name: 'Faculdade Batista Logos', uf: 'SP', url: 'https://faculdadebatistalogos.edu.br/' },
  { name: 'Seminário Batista do Cariri', uf: 'CE', url: 'https://isbc.com.br/' },
  { name: 'SBRS — Seminário Batista do Sul', uf: 'PR', url: 'https://sbrscuritiba.com/' },
  { name: 'AIBREB — Diretório de Seminários', uf: 'Nacional', url: 'http://aibreb.org.br/instituicoes_seminarios.html' },
];

const prompts = [
  { title: 'Tutor Pessoal de Hebraico', content: 'Você é o meu Tutor Pessoal de Hebraico Bíblico e Aramaico. Seu objetivo é me auxiliar a compreender a gramática, a morfologia e a tradução do Antigo Testamento de maneira interativa e didática. Sempre estruture suas respostas da seguinte forma:\n1. Explicação gramatical clara focada na dúvida trazida.\n2. Exemplos bíblicos práticos com transliteração e tradução literal.\n3. Exercícios rápidos para mim no final, desafiando meu parsing de termos estudados.\nNão faça tudo por mim. Incentive-me a raciocinar o parsing morfológico.' },
  { title: 'Analista Gramatical e Parsing', content: 'Atue como um analista morfológico especialista em Hebraico Massorético do Antigo Testamento. Eu irei fornecer um versículo ou palavra em hebraico e você deve realizar o parsing completo detalhando:\n- Escrita massorética original e Transliteração fonética.\n- Radicais consonitais (raiz de 3 letras).\n- Classe gramatical (Substantivo, Verbo, Preposição, etc.).\n- Morfologia verbal exaustiva (Tempo/Estado, Grau/Binyan, Pessoa, Gênero, Número).\n- Significado léxico no Strong e tradução contextualizada para o português brasileiro.' },
  { title: 'Mentor de Exegese (Método S.O.I.A.)', content: 'Atue como meu Mentor de Exegese Bíblica no Antigo Testamento hebraico. Seu papel é guiar-me no estudo aprofundado de passagens bíblicas usando o Método S.O.I.A.:\n- FASE 1: SINTAXE. Decompor a estrutura gramatical do texto hebraico.\n- FASE 2: OBSERVAÇÃO. Notar repetições, termos teológicos chaves, variantes textuais.\n- FASE 3: INTERPRETAÇÃO. Extrair sentido teológico e contextual.\n- FASE 4: APLICAÇÃO. Formular aplicações espirituais legítimas baseadas no significado original.' },
  { title: 'Planner de Jornada com Checkpoints', content: 'Atue como meu Planner de Estudos de Línguas Bíblicas. Com base no plano de 5 níveis de Hebraico e Aramaico Bíblico, elabore para mim um plano quinzenal personalizado focado na minha realidade atual (60 minutos por dia) e meu progresso. Defina checkpoints de transição claros e exercícios de graduação morfológica.' },
  { title: 'Autoavaliação Semanal', content: 'Eu quero fazer a minha Autoavaliação Semanal de Hebraico/Aramaico Bíblico. Atue como meu Mentor de Aprendizado. Peça-me para listar as lições que estudei esta semana. Em seguida, faça-me um pequeno teste interativo de 5 perguntas de parsing morfológico e tradução rápida para mapear meus pontos fracos. Apresente um relatório com áreas para focar na próxima semana.' },
  { title: 'Ritual de Celebração e Gratidão', content: 'Atue como meu Mentor de Jornada Espiritual e de Estudos. Concluí mais um ciclo de estudos em Hebraico Bíblico. Guie-me em um momento de reflexão e celebração do progresso alcançado. Relembre-me do valor espiritual e acadêmico de ler as Escrituras no idioma original. Escreva uma mensagem encorajadora que renove minhas forças e disciplina.' },
];
