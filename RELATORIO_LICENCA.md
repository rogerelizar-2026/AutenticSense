# Relatório de Questões Editoriais e de Licença

## Data: Setembro de 2026
## Projeto: O Sentido Autêntico — Evolução do Site

---

## ✅ Correções Editoriais Realizadas

### 1. Conflito de Classes CSS (Tailwind v4)
**Problema:** As classes customizadas `.text-hebrew` e `.text-greek` estavam sendo sobrescritas pelas classes de cor geradas automaticamente pelo Tailwind v4 (`text-hebrew: color: var(--color-hebrew)` e `text-greek: color: var(--color-greek)`).

**Impacto:** 
- Textos em hebraico não recebiam a fonte correta nem direção RTL
- Textos em grego não recebiam a fonte adequada
- Elementos com texto latino (números, títulos) recebiam cor burgundy indevidamente

**Solução:** Renomeadas as classes customizadas:
- `.text-hebrew` → `.script-hebrew`
- `.text-greek` → `.script-greek`

**Arquivos afetados:**
- `src/index.css`
- `src/components/Home.tsx`
- `src/components/HebrewSection.tsx`
- `src/components/GreekSection.tsx`

### 2. Uso Incorreto de Classes de Script em Texto Latino
**Problema:** Elementos contendo texto latino (números "25", "60min", títulos em português) estavam usando `text-greek` como classe de cor, o que aplicava a fonte grega incorretamente.

**Solução:** Substituído por `text-portal` (cor verde portal) para elementos estatísticos e títulos.

### 3. Caracteres Hebraicos Inline sem Marcação Adequada
**Problema:** Caracteres hebraicos (הַ, בְּ, לְ, כְּ, וְ) apareciam inline em texto português sem envoltório com `lang="he"` e `dir="rtl"`, causando problemas de renderização e acessibilidade.

**Solução:** Substituídos por transliteração fonética:
- "artigo הַ" → "artigo definido (ha-)"
- "preposições בְּ, לְ, כְּ" → "preposições (be-, le-, ke-)"
- "conjunção וְ" → "conjunção (ve-)"

### 4. Terminologia Incorreta
**Problema:** "Pais Apostólicos" (sem acento) usado em vez de "Pais da Igreja" (terminologia mais precisa em português).

**Solução:** Corrigido para "Pais da Igreja" no nível 5 do currículo grego.

---

## ⚠️ Questões de Licença Pendentes (Para Tratamento no GitHub)

### 1. Ambiguidade entre "Todos os Direitos Reservados" e Creative Commons
**Localização:** 
- Modal de boas-vindas (`src/components/WelcomeModal.tsx`)
- Rodapé da página inicial (`src/components/Home.tsx`)

**Descrição do Problema:**
O site original contém afirmações contraditórias:
1. "Todos os direitos reservados" (restrição total)
2. "Licenciado sob os termos da licença internacional Creative Commons" (permissivo)

Estas duas afirmações são mutuamente exclusivas. "Todos os direitos reservados" implica que nenhum direito foi concedido ao público, enquanto Creative Commons concede explicitamente certos direitos.

**Recomendações para o Proprietário:**

#### Opção A: Adotar Creative Commons (Recomendado para conteúdo educacional)
Escolher uma licença CC específica:
- **CC BY-NC-SA 4.0** (Atribuição-NãoComercial-CompartilhaIgual)
  - Permite: compartilhar e adaptar
  - Requer: atribuição ao autor, uso não comercial, mesma licença
  - Ideal para: conteúdo educacional aberto
  
- **CC BY-NC 4.0** (Atribuição-NãoComercial)
  - Permite: compartilhar e adaptar
  - Requer: atribuição ao autor, uso não comercial
  - Mais flexível que SA

- **CC BY 4.0** (Atribuição)
  - Permite: compartilhar e adaptar, inclusive comercialmente
  - Requer: apenas atribuição
  - Máxima disseminação

**Ação necessária:**
1. Escolher uma licença CC específica
2. Remover "Todos os direitos reservados"
3. Adicionar link para o texto completo da licença: https://creativecommons.org/licenses/
4. Incluir aviso de copyright: "© 2026 Rogério Ramão Lopes. Licenciado sob CC [escolha]."

#### Opção B: Manter "Todos os Direitos Reservados"
Se o proprietário deseja manter controle total:
1. Remover toda menção a Creative Commons
2. Adicionar termos de uso explícitos
3. Especificar se há permissão para uso educacional pessoal
4. Definir política de citação e compartilhamento

**Ação necessária:**
1. Remover texto sobre Creative Commons
2. Adicionar seção "Termos de Uso" detalhada
3. Especificar permissões e restrições claramente

### 2. Ausência de Link para Texto Completo da Licença
**Problema:** O texto menciona "licença internacional Creative Commons" mas não fornece:
- Link para o texto completo da licença
- Identificação da versão específica (4.0?)
- Identificação do tipo específico (BY? BY-NC? BY-NC-SA?)

**Recomendação:**
Adicionar link para a licença escolhida, por exemplo:
```html
<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">
  Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
</a>
```

### 3. Atribuição de Obras de Terceiros
**Problema:** O site menciona obras de terceiros (Ross, Rega, Mounce, Wallace) mas não esclarece:
- Se há permissão para citar trechos
- Se as capas de livros são usadas com permissão
- Se há fair use aplicável

**Recomendação:**
Adicionar seção "Atribuições e Fair Use" esclarecendo:
- Citações são usadas para fins educacionais e de crítica
- Capas de livros são usadas para identificação (fair use)
- Obras completas não são reproduzidas
- Direitos autorais das obras mencionadas permanecem com seus respectivos detentores

### 4. Links Externos e Responsabilidade
**Problema:** O site contém links para recursos externos (Step Bible, Bible Hub, Sefaria, etc.) mas não há:
- Aviso de que o conteúdo externo não é responsabilidade do autor
- Política de atualização de links quebrados
- Esclarecimento sobre endosso ou não dos recursos vinculados

**Recomendação:**
Adicionar aviso no rodapé ou página de ferramentas:
```
Os links para recursos externos são fornecidos para conveniência e não constituem endosso. 
O conteúdo de sites de terceiros é de responsabilidade de seus respectivos proprietários.
```

### 5. Política de Privacidade e Dados Locais
**Problema:** O site armazena dados localmente (favoritos, tema, posição de leitura) mas não há:
- Política de privacidade explícita
- Esclarecimento de que dados não são enviados a servidores
- Instruções de como exportar/limpar dados

**Recomendação:**
Adicionar seção "Privacidade e Dados":
```
Este site armazena dados apenas localmente no seu navegador (localStorage):
- Preferências de tema
- Recursos favoritos
- Posição de leitura

Nenhum dado é enviado a servidores externos. Você pode limpar esses dados a qualquer momento 
através das configurações do seu navegador ou usando a função "Exportar/Importar" na página 
de Ferramentas Bíblicas.
```

### 6. Isenção de Responsabilidade sobre Conteúdo Gerado por IA
**Problema:** O site promove uso de IA (Notebook Gemini) para estudos, mas não há:
- Aviso sobre limitações de IA para línguas bíblicas
- Esclarecimento de que respostas de IA não são autoridade acadêmica
- Recomendação de verificar com fontes primárias

**Recomendação:**
Adicionar aviso na seção de prompts de IA:
```
⚠️ Importante: As respostas de modelos de IA para línguas bíblicas podem conter erros. 
Sempre verifique informações críticas com gramáticas acadêmicas, léxicos e professores qualificados. 
IA é uma ferramenta auxiliar, não substitui estudo rigoroso.
```

---

## 📋 Checklist de Ações para o Proprietário

### Prioridade Alta (Legal)
- [ ] Decidir entre Creative Commons ou "Todos os direitos reservados"
- [ ] Escolher licença CC específica (se aplicável)
- [ ] Atualizar texto legal no modal e rodapé
- [ ] Adicionar link para texto completo da licença
- [ ] Adicionar seção de atribuições e fair use

### Prioridade Média (Transparência)
- [ ] Adicionar política de privacidade
- [ ] Adicionar aviso sobre links externos
- [ ] Adicionar isenção sobre conteúdo de IA
- [ ] Esclarecer política de atualização de recursos

### Prioridade Baixa (Melhorias)
- [ ] Adicionar data de última atualização
- [ ] Adicionar changelog/histórico de versões
- [ ] Adicionar formulário de contato para reportar links quebrados
- [ ] Adicionar seção de perguntas frequentes (FAQ)

---

## 📊 Resumo Técnico

### Arquivos Modificados nesta Correção
1. `src/index.css` — Renomeação de classes
2. `src/components/Home.tsx` — Correção de classes e caracteres
3. `src/components/HebrewSection.tsx` — Correção de caracteres inline
4. `src/components/GreekSection.tsx` — Correção de classes e terminologia

### Build Final
- HTML: 2.43 KB (1.05 KB gzip)
- CSS: 29.07 KB (6.19 KB gzip)
- JS: 223.70 KB (68.49 KB gzip)

### Status
✅ Todas as questões editoriais de mistura de scripts foram corrigidas
⚠️ Questões de licença documentadas para tratamento pelo proprietário
✅ Build bem-sucedido sem erros

---

## 📞 Contato para Questões de Licença

Para discutir e resolver as questões de licença, o proprietário deve:
1. Revisar este relatório
2. Decidir sobre a licença desejada
3. Atualizar os arquivos relevantes
4. Commitar as alterações no GitHub

**Contato do Curador:** rogerelizar@gmail.com

---

*Relatório gerado em Setembro de 2026*
*Projeto: O Sentido Autêntico — Evolução do Site*
