import { useState } from 'react';

interface Props {
  onAccept: () => void;
  isDark: boolean;
}

export function WelcomeModal({ onAccept, isDark }: Props) {
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accepted) {
      onAccept();
    }
  };

  const surface = isDark ? 'bg-dark-surface' : 'bg-paper';
  const textSec = isDark ? 'text-dark-ink-secondary' : 'text-ink-secondary';

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4" 
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        className={`${surface} rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto`}
        style={{ position: 'relative', zIndex: 10000 }}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <h2 id="welcome-title" className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Bem-vindo(a) ao O Sentido Autêntico
          </h2>

          <div className={`space-y-4 text-sm ${textSec} mb-6 max-h-[50vh] overflow-y-auto pr-2`}>
            <div>
              <p className="mb-2">
                Idealizador e Curador: <strong>Rogério Ramão Lopes</strong><br />
                Contato: rogerelizar@gmail.com
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Propósito e Isenção de Responsabilidade</h3>
              <p className="mb-2"><strong>Este material NÃO tem o propósito de:</strong></p>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                <li>Formar hermeneutas ou exegetas profissionais</li>
                <li>Substituir formação acadêmica formal em teologia ou línguas bíblicas</li>
                <li>Fornecer certificação ou credenciamento acadêmico</li>
                <li>Estabelecer doutrinas ou interpretações teológicas definitivas</li>
                <li>Substituir o acompanhamento de professores qualificados ou mentores espirituais</li>
              </ul>
              <p className="mb-2"><strong>Este material TEM o propósito de:</strong></p>
              <ul className="list-disc pl-5 space-y-1 mb-3">
                <li>Oferecer um recurso imparcial e abrangente para o início do aprendizado</li>
                <li>Apresentar diferentes métodos e abordagens de forma organizada</li>
                <li>Auxiliar na escolha de recursos adequados ao perfil de cada aprendiz</li>
                <li>Facilitar o acesso a informações sobre o estudo dessas línguas</li>
                <li>Encorajar o estudo pessoal das Escrituras em seus idiomas originais</li>
              </ul>
              <blockquote className={`border-l-4 pl-3 italic ${isDark ? 'border-gold/50' : 'border-portal/30'}`}>
                O estudo das línguas bíblicas é um complemento valioso à leitura das traduções, mas não substitui a orientação espiritual, o discipulado comunitário e a busca por sabedoria divina. Use estes recursos com humildade, respeito e discernimento.
              </blockquote>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Licença</h3>
              <p>
                Este projeto foi idealizado e desenvolvido sob a curadoria teológica e acadêmica de <strong>Rogério Ramão Lopes</strong> em Setembro de 2026.
              </p>
              <p className="mt-2">
                Licenciado sob os termos da licença internacional Creative Commons. Você está livre para compartilhar e adaptar o material, desde que atribua o crédito apropriado ao autor, não o utilize para fins comerciais e distribua suas contribuições sob a mesma licença.
              </p>
              <p className={`mt-2 text-xs italic ${isDark ? 'text-gold' : 'text-gold-dark'}`}>
                ⚠️ Nota: Há ambiguidade entre "Todos os direitos reservados" e a licença Creative Commons no site original. Recomenda-se revisão pelo proprietário.
              </p>
            </div>
          </div>

          <div className={`p-3 rounded-lg mb-4 ${isDark ? 'bg-white/5' : 'bg-surface'}`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={e => setAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-2 flex-shrink-0"
              />
              <span className="text-sm">
                Compreendo e aceito o propósito, as isenções de responsabilidade e as diretrizes de estudo pessoal.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!accepted}
            className={`w-full py-3 rounded-xl font-semibold min-h-[48px] transition-colors ${
              accepted
                ? 'bg-portal text-white hover:bg-portal-light cursor-pointer'
                : isDark ? 'bg-white/10 text-dark-ink-secondary cursor-not-allowed' : 'bg-surface text-ink-secondary cursor-not-allowed'
            }`}
          >
            Iniciar Minha Jornada
          </button>

          <button
            type="button"
            onClick={onAccept}
            className={`w-full mt-2 py-2 text-sm ${textSec} hover:underline`}
          >
            Pular e aceitar os termos
          </button>
        </form>
      </div>
    </div>
  );
}
