import { useState, useMemo, useCallback, useEffect } from 'react';
import { resources, categories, type Resource } from '../data/resources';

interface Props { isDark: boolean; }

type LanguageFilter = 'todos' | 'hebraico' | 'grego';
type LevelFilter = 'todos' | 'iniciante' | 'intermediario' | 'avancado';
type ViewMode = 'catalog' | 'collection';

export function ToolsSection({ isDark }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [language, setLanguage] = useState<LanguageFilter>('todos');
  const [level, setLevel] = useState<LevelFilter>('todos');
  const [viewMode, setViewMode] = useState<ViewMode>('catalog');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Load favorites from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('osa-favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Save favorites
  useEffect(() => {
    localStorage.setItem('osa-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      if (search) {
        const q = search.toLowerCase();
        if (!r.name.toLowerCase().includes(q) && !r.author.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
      }
      if (category !== 'Todos' && r.category !== category) return false;
      if (language !== 'todos' && r.language !== language && r.language !== 'ambos') return false;
      if (level !== 'todos' && r.level !== level && r.level !== 'todos') return false;
      return true;
    });
  }, [search, category, language, level]);

  const collectionResources = useMemo(() => {
    return resources.filter(r => favorites.includes(r.id));
  }, [favorites]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setCategory('Todos');
    setLanguage('todos');
    setLevel('todos');
  }, []);

  const hasActiveFilters = search || category !== 'Todos' || language !== 'todos' || level !== 'todos';

  const handleExport = useCallback(() => {
    const data = { favorites, exportedAt: new Date().toISOString(), version: 1 };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'osa-colecao-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [favorites]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setImportStatus('Erro: arquivo muito grande (máximo 5MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.favorites && Array.isArray(data.favorites)) {
          const validIds = data.favorites.filter((id: string) => resources.some(r => r.id === id));
          setFavorites(prev => [...new Set([...prev, ...validIds])]);
          setImportStatus(`Importado com sucesso: ${validIds.length} recursos adicionados.`);
        } else {
          setImportStatus('Erro: formato de arquivo inválido.');
        }
      } catch {
        setImportStatus('Erro: não foi possível ler o arquivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  const surface = isDark ? 'bg-dark-surface' : 'bg-surface';
  const textSec = isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary';
  const border = isDark ? 'border-white/10' : 'border-gold/20';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 md:ml-60" id="ferramentas">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Ferramentas Bíblicas
        </h1>
        <p className={`text-center ${textSec} max-w-2xl mx-auto`}>
          Mineração curada para conectar você aos recursos mais valiosos das línguas bíblicas. Busque, filtre e organize.
        </p>
      </header>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('catalog')}
          className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] transition-colors ${
            viewMode === 'catalog'
              ? isDark ? 'bg-gold/20 text-gold' : 'bg-portal/10 text-portal'
              : `${textSec}`
          }`}
        >
          📚 Catálogo ({resources.length})
        </button>
        <button
          onClick={() => setViewMode('collection')}
          className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] transition-colors ${
            viewMode === 'collection'
              ? isDark ? 'bg-gold/20 text-gold' : 'bg-portal/10 text-portal'
              : `${textSec}`
          }`}
        >
          ⭐ Minha coleção ({favorites.length})
        </button>
      </div>

      {viewMode === 'catalog' && (
        <>
          {/* Search */}
          <div className="mb-4">
            <label htmlFor="resource-search" className="sr-only">Buscar recursos</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg" aria-hidden="true">🔍</span>
              <input
                id="resource-search"
                type="search"
                placeholder="Buscar por nome, autor ou descrição..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border min-h-[48px] ${
                  isDark ? 'bg-dark-surface border-white/10 text-dark-ink placeholder:text-dark-ink-secondary/50' : 'bg-paper border-gold/20 text-ink placeholder:text-ink-secondary/50'
                }`}
              />
            </div>
          </div>

          {/* Filter Toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl border mb-3 min-h-[44px] ${border}`}
            aria-expanded={showFilters}
          >
            <span className="text-sm font-medium">Filtros {hasActiveFilters && '(ativo)'}</span>
            <span aria-hidden="true">{showFilters ? '▲' : '▼'}</span>
          </button>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block mb-4 space-y-3`}>
            <div className="flex flex-wrap gap-2">
              <fieldset className="flex flex-wrap gap-1">
                <legend className="sr-only">Categoria</legend>
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium min-h-[36px] transition-colors ${
                      category === c
                        ? 'bg-portal text-white'
                        : isDark ? 'bg-white/10 text-dark-ink-secondary' : 'bg-surface text-ink-secondary'
                    }`}
                    aria-pressed={category === c}
                  >
                    {c}
                  </button>
                ))}
              </fieldset>
            </div>
            <div className="flex flex-wrap gap-3">
              <div>
                <label htmlFor="lang-filter" className={`text-xs font-medium ${textSec}`}>Idioma:</label>
                <select
                  id="lang-filter"
                  value={language}
                  onChange={e => setLanguage(e.target.value as LanguageFilter)}
                  className={`ml-2 px-2 py-1 rounded-lg text-sm border min-h-[36px] ${isDark ? 'bg-dark-surface border-white/10' : 'bg-paper border-gold/20'}`}
                >
                  <option value="todos">Todos</option>
                  <option value="hebraico">Hebraico</option>
                  <option value="grego">Grego</option>
                </select>
              </div>
              <div>
                <label htmlFor="level-filter" className={`text-xs font-medium ${textSec}`}>Nível:</label>
                <select
                  id="level-filter"
                  value={level}
                  onChange={e => setLevel(e.target.value as LevelFilter)}
                  className={`ml-2 px-2 py-1 rounded-lg text-sm border min-h-[36px] ${isDark ? 'bg-dark-surface border-white/10' : 'bg-paper border-gold/20'}`}
                >
                  <option value="todos">Todos</option>
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-gold-dark hover:underline min-h-[36px] px-2">
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Results count */}
          <p className={`text-sm mb-3 ${textSec}`} role="status" aria-live="polite">
            {filteredResources.length} recurso{filteredResources.length !== 1 ? 's' : ''} encontrado{filteredResources.length !== 1 ? 's' : ''}
          </p>

          {/* Resource Cards */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredResources.map(r => (
                <ResourceCard key={r.id} resource={r} isFav={favorites.includes(r.id)} onToggleFav={() => toggleFavorite(r.id)} isDark={isDark} />
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 rounded-xl ${surface}`}>
              <span className="text-4xl mb-3 block" aria-hidden="true">🔍</span>
              <p className="font-medium">Nenhum recurso encontrado</p>
              <p className={`text-sm ${textSec}`}>Tente ajustar os filtros ou termos de busca.</p>
            </div>
          )}
        </>
      )}

      {viewMode === 'collection' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={handleExport} className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] border ${border}`}>
              📤 Exportar backup JSON
            </button>
            <label className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] border ${border} cursor-pointer`}>
              📥 Importar JSON
              <input type="file" accept=".json" onChange={handleImport} className="sr-only" />
            </label>
          </div>
          {importStatus && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${isDark ? 'bg-gold/20 text-gold' : 'bg-gold/10 text-gold-dark'}`} role="status">
              {importStatus}
            </div>
          )}
          <p className={`text-sm mb-3 ${textSec}`}>
            💡 Dados salvos neste dispositivo. Não sincroniza automaticamente entre dispositivos.
          </p>
          {collectionResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {collectionResources.map(r => (
                <ResourceCard key={r.id} resource={r} isFav={true} onToggleFav={() => toggleFavorite(r.id)} isDark={isDark} />
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 rounded-xl ${surface}`}>
              <span className="text-4xl mb-3 block" aria-hidden="true">⭐</span>
              <p className="font-medium">Sua coleção está vazia</p>
              <p className={`text-sm ${textSec}`}>Favorite recursos do catálogo para organizá-los aqui.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResourceCard({ resource, isFav, onToggleFav, isDark }: { resource: Resource; isFav: boolean; onToggleFav: () => void; isDark: boolean }) {
  const border = isDark ? 'border-white/10' : 'border-gold/20';
  const textSec = isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary';
  const levelColors: Record<string, string> = {
    iniciante: 'bg-green-100 text-green-800',
    intermediario: 'bg-yellow-100 text-yellow-800',
    avancado: 'bg-red-100 text-red-800',
    todos: 'bg-blue-100 text-blue-800',
  };
  const levelLabels: Record<string, string> = {
    iniciante: '🌱 Iniciante',
    intermediario: '🌿 Intermediário',
    avancado: '🌳 Avançado',
    todos: '📊 Todos os níveis',
  };

  return (
    <article className={`p-4 rounded-xl border ${border} flex flex-col gap-2`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-sm">{resource.name}</h3>
          <p className={`text-xs ${textSec}`}>✍️ {resource.author}</p>
        </div>
        <button
          onClick={onToggleFav}
          className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center min-w-[44px] min-h-[44px] ${isFav ? 'text-gold' : textSec}`}
          aria-label={isFav ? `Remover ${resource.name} dos favoritos` : `Adicionar ${resource.name} aos favoritos`}
          aria-pressed={isFav}
        >
          {isFav ? '★' : '☆'}
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-white/10' : 'bg-surface'}`}>{resource.category}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-white/10' : 'bg-surface'}`}>{resource.language === 'hebraico' ? 'Hebraico' : resource.language === 'grego' ? 'Grego' : 'Ambos'}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${levelColors[resource.level] || ''}`}>{levelLabels[resource.level] || resource.level}</span>
        {resource.free && <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">🆓 Gratuito</span>}
      </div>
      <p className={`text-xs ${textSec} leading-relaxed`}>{resource.description}</p>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium text-portal hover:underline self-start mt-auto"
      >
        Visitar recurso ↗
      </a>
    </article>
  );
}
