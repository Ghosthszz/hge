# HGE Iluminação — recriação estática multi-página

Projeto front-end estático inspirado no modelo visual azul-marinho/laranja que desenvolvemos. Inclui páginas institucionais, páginas de categorias, catálogo demonstrativo, detalhe de produto, contato e páginas informativas.

## Como abrir
- Abra `index.html` no navegador para visualizar.
- Para desenvolvimento, abra a pasta no VS Code. Recomenda-se a extensão Live Server para navegar entre páginas sem limitações do navegador.
- O site não precisa de build nem instalação de dependências.

## Estrutura
- `index.html`: página inicial
- `loja.html`: catálogo demonstrativo com busca e filtro de categoria
- `orcamento.html`: lista de orçamento com quantidades, remoção, armazenamento local no navegador e envio da lista pelo WhatsApp
- `pages/`: empresa, contato, soluções e categorias
- `produto/index.html`: detalhe dinâmico dos produtos
- `politicas/`: páginas de referência com links para documentos oficiais
- `assets/css/style.css`: estilos responsivos
- `assets/js/main.js`: menu, filtros, contato e lista/carrinho de orçamento e envio da cotação pelo WhatsApp
- `assets/js/products.js`: dados do catálogo demonstrativo
- `assets/img/`: ilustrações SVG locais criadas para o protótipo

## Importante
Esta é uma recriação visual e funcional de front-end, não uma cópia integral do back-end/WordPress/WooCommerce oficial. O catálogo contém itens selecionados com base em conteúdo público indexado; não é sincronizado com estoque, preços, pedidos, login, carrinho de compra, pagamento ou administração da loja oficial; a lista de orçamento deste protótipo é local ao navegador. Os itens sem preço levam o cliente a consultar a equipe. As fotos dos produtos vêm do site oficial da HGE (veja "Atualização v4"); as ilustrações SVG locais só aparecem como reserva quando uma foto não carrega ou não existe. Confirme características, certificações, disponibilidade e condições diretamente com a HGE.

## Contato público verificado
- Telefone/WhatsApp: (11) 2679-3996
- E-mail: vendas2@hgeiluminacao.com.br
- Atendimento publicado: segunda a sexta, 8h às 17h, exceto feriados

## Antes de publicar
1. Substitua o wordmark provisório pela marca oficial autorizada.
2. Substitua as ilustrações genéricas por fotos oficiais autorizadas e correspondentes a cada SKU.
3. Ajuste `sitemap.xml` para o domínio de hospedagem real.
4. Confirme termos, privacidade, preços, especificações, certificações e dados comerciais com a empresa.
5. Configure formulário/backend e analytics apenas se forem necessários e com os avisos de privacidade adequados.

## Atualização v3 (visual animado e correções de CSS/JS)
Somente `assets/css/style.css` e `assets/js/main.js` foram alterados; HTML, produtos e imagens permanecem iguais.

**Correções**
- Atributo `hidden` era anulado por `display:flex` inline: os botões "Enviar/Limpar" apareciam com a lista de orçamento vazia (agora `[hidden]{display:none!important}`).
- Menu: com o link "Meu orçamento" o cabeçalho estourava entre 720 e 1120 px; o menu de celular agora abre a partir de 860 px e o link do orçamento fica antes do botão de WhatsApp.
- `alert()` no "Adicionar ao orçamento" trocado por aviso (toast); sincronização do contador entre abas.
- Busca do catálogo agora ignora acentos ("luminaria" encontra "Luminária") e mostra a contagem de resultados.
- Estilos de orçamento (`quote-*`) centralizados no CSS; textos do detalhe do produto passam por escape de HTML.
- Ícones de texto (✦ ◈ ↗ ☼ ☎ ◉ ✉ ☰) trocados por SVG inline.

**Visual (keyframes)**
Hero com partículas de luz, brilho pulsando nos postes, título em gradiente animado; faixa em marquee; revelação ao rolar com escalonamento; cartões com inclinação 3D e brilho que segue o cursor; botões com brilho e ondas; contadores; barra de progresso; transições entre páginas; CTA e páginas internas com fundos animados. Respeita `prefers-reduced-motion`.

## Atualização v4 (fotos reais dos produtos)
- `assets/js/products.js`: cada produto passa a apontar para as fotos publicadas na página dele na loja oficial (`https://hgeiluminacao.com.br/wp-content/uploads/...`), incluindo as galerias (miniaturas na página do produto).
- `assets/js/main.js`: troca as ilustrações pelas fotos reais nos cartões de produto, nos cartões "Soluções" e nas páginas de categoria. A troca só acontece depois que a foto carrega; sem internet ou com o arquivo removido, o site mostra a ilustração local de `assets/img/` como antes.
- `assets/css/style.css`: fotos em fundo branco, sem corte, com miniaturas selecionáveis.
- Também corrigido: migalhas de pão duplicadas na página de produto.
- **Sem foto real (continuam com ilustração):** "Spots e iluminação para trilho", "Luminária solar integrada" e "Soluções de energia solar" (a loja oficial não tem fotos desses itens). "Painéis LED comerciais" e "Refletores LED" usam a foto do produto real mais próximo (luminária slim de embutir 4×18 e refletor High Bay Taiti).
- As fotos são carregadas do próprio site da HGE; para uso 100% offline, baixe os arquivos para `assets/img/` e troque as URLs em `products.js`.


## Atualização v5 — imagens locais

- `assets/js/products.js` agora aponta para `/assets/products/` em vez de depender das URLs remotas.
- `assets/products-download-manifest.json` lista as imagens oficiais de origem.
- Para baixar as fotografias, conecte o computador à internet e execute `BAIXAR-IMAGENS.bat` (Windows) ou `python baixar_imagens.py` (Python 3).
- **Importante:** este pacote foi preparado num ambiente sem acesso DNS à internet; portanto, as fotografias ainda não foram incluídas neste ZIP. Execute o downloader antes de publicar para preencher `assets/products/`. O script informa as URLs que falharem.
