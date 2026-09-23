import { useState, useEffect, useCallback } from 'react';
import { Home } from './components/Home';
import { HebrewSection } from './components/HebrewSection';
import { GreekSection } from './components/GreekSection';
import { ToolsSection } from './components/ToolsSection';
import { WelcomeModal } from './components/WelcomeModal';

type Section = 'home' | 'hebrew' | 'greek' | 'tools';

function getSectionFromHash(): Section {
  const hash = window.location.hash.slice(1);
  if (hash.startsWith('heb')) return 'hebrew';
  if (hash.startsWith('grk')) return 'greek';
  if (hash.startsWith('tools') || hash.startsWith('ferramentas')) return 'tools';
  return 'home';
}

export default function App() {
  console.log('App renderizando...');
  const [section, setSection] = useState<Section>(getSectionFromHash);
  const [showWelcome, setShowWelcome] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Theme management
  const [systemDark, setSystemDark] = useState(() => 
    typeof window !== 'undefined' ? window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false : false
  );
  
  console.log('Estado:', { section, showWelcome, theme, systemDark });

  useEffect(() => {
    const saved = localStorage.getItem('osa-theme') as 'light' | 'dark' | 'system' | null;
    if (saved) setTheme(saved);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem('osa-theme', theme);
  }, [theme]);

  // Hash navigation
  useEffect(() => {
    const handler = () => setSection(getSectionFromHash());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  // Welcome modal
  useEffect(() => {
    const accepted = localStorage.getItem('osa-terms-accepted');
    if (!accepted) setShowWelcome(true);
  }, []);

  const navigate = useCallback((s: Section) => {
    setSection(s);
    const hashes: Record<Section, string> = { home: '', hebrew: '#heb-portal', greek: '#grk-portal', tools: '#ferramentas' };
    window.location.hash = hashes[s];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAcceptTerms = useCallback(() => {
    localStorage.setItem('osa-terms-accepted', 'true');
    setShowWelcome(false);
  }, []);

  const isDark = theme === 'dark' || (theme === 'system' && systemDark);

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'block',
        backgroundColor: isDark ? '#1A2530' : '#FBFAF7',
        color: isDark ? '#F0EDE6' : '#1A2530'
      }}
    >
      <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>

      {/* Header */}
      <header className={`sticky top-0 z-40 border-b no-print ${isDark ? 'bg-dark-surface/95 border-white/10 backdrop-blur-sm' : 'bg-paper/95 border-gold/20 backdrop-blur-sm'}`} style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate('home')} className="flex items-center gap-2 min-w-0" aria-label="Ir para página inicial">
            <span className="font-display text-lg font-bold tracking-wide truncate" style={{ fontFamily: 'var(--font-display)' }}>
              <span className={isDark ? 'text-gold' : 'text-portal'}>O</span>{' '}
              <span className={isDark ? 'text-dark-ink' : 'text-ink'}>Sentido Autêntico</span>
            </span>
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme(t => t === 'light' ? 'dark' : t === 'dark' ? 'system' : 'light')}
              className="p-2 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={`Tema atual: ${theme}. Clique para alternar.`}
              title={`Tema: ${theme}`}
            >
              {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '⚙️'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="pb-20 md:pb-8" tabIndex={-1} style={{ display: 'block' }}>
        {section === 'home' && <Home navigate={navigate} isDark={isDark} />}
        {section === 'hebrew' && <HebrewSection isDark={isDark} />}
        {section === 'greek' && <GreekSection isDark={isDark} />}
        {section === 'tools' && <ToolsSection isDark={isDark} />}
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom no-print" aria-label="Navegação principal">
        <div className={`${isDark ? 'bg-dark-surface border-white/10' : 'bg-paper border-gold/20'} border-t`}>
          <div className="flex justify-around items-stretch">
            {([
              { id: 'home' as Section, label: 'Início', icon: '🏠' },
              { id: 'hebrew' as Section, label: 'Hebraico', icon: '📜' },
              { id: 'greek' as Section, label: 'Grego', icon: '🏛️' },
              { id: 'tools' as Section, label: 'Ferramentas', icon: '🔧' },
            ]).map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[52px] flex-1 transition-colors ${
                  section === item.id
                    ? isDark ? 'text-gold border-t-2 border-gold' : 'text-portal border-t-2 border-portal'
                    : isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary'
                }`}
                aria-current={section === item.id ? 'page' : undefined}
              >
                <span className="text-lg" aria-hidden="true">{item.icon}</span>
                <span className="text-xs font-medium mt-0.5">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Desktop Side Nav */}
      <nav className="hidden md:flex fixed left-0 top-14 bottom-0 w-56 z-30 flex-col py-6 px-3 no-print border-r"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(197,160,89,0.2)' }}
        aria-label="Navegação principal">
        {([
          { id: 'home' as Section, label: 'Início', icon: '🏠' },
          { id: 'hebrew' as Section, label: 'Hebraico e Aramaico', icon: '📜' },
          { id: 'greek' as Section, label: 'Grego Koiné', icon: '🏛️' },
          { id: 'tools' as Section, label: 'Ferramentas Bíblicas', icon: '🔧' },
        ]).map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left min-h-[44px] transition-colors ${
              section === item.id
                ? isDark ? 'bg-gold/20 text-gold font-semibold' : 'bg-portal/10 text-portal font-semibold'
                : isDark ? 'text-dark-ink-secondary hover:text-dark-ink hover:bg-white/5' : 'text-ink-secondary hover:text-ink hover:bg-surface'
            }`}
            aria-current={section === item.id ? 'page' : undefined}
          >
            <span aria-hidden="true">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Welcome Modal */}
      {showWelcome && <WelcomeModal onAccept={handleAcceptTerms} isDark={isDark} />}
    </div>
  );
}
