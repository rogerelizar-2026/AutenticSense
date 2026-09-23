import { useState, useEffect } from 'react';
import { type Section } from '../types';

interface HomeProps {
  navigate: (s: Section) => void;
  isDark: boolean;
}

export function Home({ navigate, isDark }: HomeProps) {
  const [savedPosition, setSavedPosition] = useState<{ section: Section; label: string } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('osa-reading-position');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.section && data.label) {
          setSavedPosition(data);
        }
      }
    } catch { /* ignore */ }
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 md:ml-60">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
          <span className={isDark ? 'text-gold' : 'text-portal'}>O Sentido Autêntico</span>
        </h1>
        <p className={`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'}`}>
          Tecnologia e profundidade histórica para conectar você ao sopro original de Deus.
        </p>
        <p className={`mt-4 text-base max-w-xl mx-auto ${isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'}`}>
          Iniciar o estudo das línguas bíblicas originais é dar um passo profundo em direção ao conhecimento de Deus nas Escrituras. Essa caminhada transformará sua compreensão do texto sagrado e a forma como você enxerga a vida.
        </p>

        {/* Scripture preview */}
        <div className={`mt-8 p-4 rounded-xl ${isDark ? 'bg-dark-surface' : 'bg-surface'}`}>
          <p className="script-hebrew text-2xl mb-2" lang="he" dir="rtl">בְּרֵאשִׁית בָּרָא אֱלֹהִים</p>
          <p className="script-greek text-xl" lang="grc">Ἐν ἀρχῇ ἦν ὁ λόγος</p>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={() => navigate('hebrew')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white bg-portal hover:bg-portal-light transition-colors min-h-[48px] text-lg"
          >
            Começar meus estudos
            <span aria-hidden="true">→</span>
          </button>
          {savedPosition && (
            <button
              onClick={() => navigate(savedPosition.section)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                isDark ? 'bg-gold/20 text-gold hover:bg-gold/30' : 'bg-gold/10 text-gold-dark hover:bg-gold/20'
              }`}
            >
              📖 Continuar de onde parei: {savedPosition.label}
            </button>
          )}
        </div>
      </section>

      {/* Destination Cards */}
      <section aria-labelledby="destinations-heading" className="mb-12">
        <h2 id="destinations-heading" className="text-xl font-bold mb-6 text-center">Escolha seu caminho de estudo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DestinationCard
            onClick={() => navigate('hebrew')}
            title="Hebraico e Aramaico"
            description="Currículo completo de 5 níveis: do alefato à fluência. 25 métodos analisados, recursos gratuitos e pagos, e prompts de IA."
            icon="📜"
            color={isDark ? 'bg-hebrew-light/20 border-hebrew-light' : 'bg-hebrew/5 border-hebrew/30'}
            isDark={isDark}
          />
          <DestinationCard
            onClick={() => navigate('greek')}
            title="Grego Koiné"
            description="Do alfabeto à sintaxe exegética de Wallace. Método Rega + Mounce + Wallace integrado com IA para aceleração."
            icon="🏛️"
            color={isDark ? 'bg-greek-light/20 border-greek-light' : 'bg-greek/5 border-greek/30'}
            isDark={isDark}
          />
          <DestinationCard
            onClick={() => navigate('tools')}
            title="Ferramentas Bíblicas"
            description="Catálogo curado de recursos: gramáticas, léxicos, softwares, apps e bases de dados. Busque, filtre e organize."
            icon="🔧"
            color={isDark ? 'bg-gold/20 border-gold' : 'bg-gold/5 border-gold/30'}
            isDark={isDark}
          />
        </div>
      </section>

      {/* Quick Start */}
      <section aria-labelledby="quickstart-heading" className={`p-6 rounded-xl ${isDark ? 'bg-dark-surface' : 'bg-surface'}`}>
        <h2 id="quickstart-heading" className="text-xl font-bold mb-4">Como começar</h2>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-portal text-white flex items-center justify-center text-sm font-bold">1</span>
            <span><strong>Escolha uma língua</strong> — Hebraico/Aramaico ou Grego Koiné. Recomendamos focar em uma de cada vez.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-portal text-white flex items-center justify-center text-sm font-bold">2</span>
            <span><strong>Comece pela Fundação</strong> — Domine o alfabeto, vogais e pronúncia antes de avançar.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-portal text-white flex items-center justify-center text-sm font-bold">3</span>
            <span><strong>Estabeleça uma rotina</strong> — 30 a 60 minutos diários de consistência superam maratonas esporádicas.</span>
          </li>
        </ol>
      </section>

      {/* Support */}
      <section className={`mt-10 p-6 rounded-xl text-center ${isDark ? 'bg-dark-surface' : 'bg-surface'}`}>
        <h2 className="text-lg font-bold mb-2">Apoie o Projeto ☕</h2>
        <p className={`text-sm ${isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'} mb-4`}>
          Se este portal tem sido útil para seus estudos das línguas originais, apoie a curadoria de Rogério Ramão Lopes! Sua contribuição voluntária ajuda a manter este ecossistema sempre atualizado e 100% gratuito.
        </p>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-paper'}`}>
          <span className="text-sm font-medium">Chave PIX (E-mail):</span>
          <code className="text-sm font-bold">rogerelizar@gmail.com</code>
        </div>
      </section>

      {/* Institutions */}
      <section className={`mt-8 p-6 rounded-xl ${isDark ? 'bg-dark-surface' : 'bg-surface'}`}>
        <h2 className="text-lg font-bold mb-3">Instituições Recomendadas</h2>
        <p className={`text-sm ${isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'} mb-3`}>
          O estudo individual não substitui a mentoria face a face de uma comunidade acadêmica formal.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            { name: 'Faculdade Batista Logos', uf: 'SP', url: 'https://faculdadebatistalogos.edu.br/' },
            { name: 'Seminário Batista do Cariri', uf: 'CE', url: 'https://isbc.com.br/' },
            { name: 'SBRS — Seminário Batista do Sul', uf: 'PR', url: 'https://sbrscuritiba.com/' },
            { name: 'AIBREB — Diretório de Seminários', uf: 'Nacional', url: 'http://aibreb.org.br/instituicoes_seminarios.html' },
          ].map((inst, i) => (
            <a key={i} href={inst.url} target="_blank" rel="noopener noreferrer" className={`p-3 rounded-lg text-sm hover:underline ${isDark ? 'bg-white/5' : 'bg-paper'}`}>
              <span className="font-medium">{inst.name}</span>
              <span className={`ml-2 text-xs ${isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'}`}>({inst.uf})</span>
            </a>
          ))}
        </div>
      </section>

      {/* Curator info */}
      <footer className="mt-12 pt-8 border-t text-center text-sm" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(197,160,89,0.2)' }}>
        <p className={isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'}>
          Idealizador e Curador: <strong>Rogério Ramão Lopes</strong>
        </p>
        <p className={`mt-1 ${isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'}`}>
          Contato: <a href="mailto:rogerelizar@gmail.com" className="underline hover:no-underline">rogerelizar@gmail.com</a>
        </p>
        <p className={`mt-3 text-xs ${isDark ? 'text-dark-ink-secondary/70' : 'text-ink-secondary/70'}`}>
          © Setembro de 2026 · Curadoria teológica e acadêmica.
        </p>
        <p className={`mt-1 text-xs ${isDark ? 'text-dark-ink-secondary/70' : 'text-ink-secondary/70'}`}>
          Licenciado sob Creative Commons (atribuição, não comercial, mesma licença).
        </p>
        <p className={`mt-2 text-xs italic ${isDark ? 'text-gold/70' : 'text-gold-dark/70'}`}>
          ⚠️ Nota para o proprietário: Há ambiguidade entre "Todos os direitos reservados" e a licença Creative Commons no site original. Recomenda-se revisão para esclarecer os termos definitivos.
        </p>
      </footer>
    </div>
  );
}

function DestinationCard({ onClick, title, description, icon, color, isDark }: {
  onClick: () => void; title: string; description: string; icon: string; color: string; isDark: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-6 rounded-xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${color} min-h-[160px] flex flex-col justify-between`}
    >
      <span className="text-3xl mb-3" aria-hidden="true">{icon}</span>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className={`text-sm leading-relaxed ${isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'}`}>{description}</p>
    </button>
  );
}
