# Catálogo de Natal — Coleção Guirlandas Artesanais

Mini-site estático (HTML/CSS/JS, sem build). Funciona de dois jeitos com o mesmo código:
navegar online e gerar um PDF A4 (capa + 1 página por produto) para enviar no WhatsApp.

## Como abrir
Dê dois cliques em `index.html` (abre direto do arquivo) ou publique a pasta em qualquer hospedagem estática.

## Como gerar o PDF
**Pelo navegador:** clique em **Salvar PDF** (ou Ctrl+P) e, na janela de impressão:
- Destino: *Salvar como PDF*
- Papel: A4 · Margens: *Nenhuma* · Gráficos de segundo plano: *ativado*
- Cabeçalhos e rodapés: *desativado*

Os botões de pedido ("Pedir …") continuam clicáveis no PDF.

**Por script (confere o resultado):** `python3 -I scripts/verify-pdf.py` gera
`dist/catalogo-guirlandas-natal-2026.pdf` e confere páginas A4, links do WhatsApp, fotos, textos e peso.

## Como atualizar
Tudo que muda fica em `js/data.js`:
- **Preço, tamanho, nome ou WhatsApp:** edite o item em `products` (ou `whatsapp`).
- **Novo produto:** coloque as fotos em `/mnt/user-data/uploads` no padrão
  `[id]-[nome]-full.png`, `-detail1.png` e (opcional) `-detail2.png`, rode
  `python3 -I scripts/optimize-images.py` e acrescente um item em `products`
  (com `photos("[id]-[nome]", [[w,h],[w,h],[w,h]])` — larguras/alturas dos JPEGs gerados;
  com um detalhe só, passe apenas dois pares). Produto sem a foto principal e o detalhe 1 é ignorado, sem quebrar nada.
- **Campos opcionais do produto:** `size` (sem ele a página mostra só o valor, centralizado),
  `feature` (selo extra no cabeçalho, ex.: "Com iluminação"),
  `ctaLabel` (texto do botão; padrão "Pedir a <título>") e `article: "o"` (mensagem do WhatsApp
  "Quero comprar o …"; padrão "a").
- **Ordem das páginas:** primeiro a linha que aparece antes em `lines`, depois a ordem dos itens em `products`.
  Hoje: Escapulários e Outros Enfeites (tema bordô), Linha Vime, Linha Palha e, ao final, a página de
  iluminação com fio de fada + pagamento e contato (`lighting` em `js/data.js`).
- **Nova linha:** acrescente em `lines` (`nav` é o nome curto do atalho na barra) e use o mesmo `line`
  nos produtos; para um tema novo, crie `css/theme-<nome>.css` seguindo `theme-bordo.css`.

As fotos nunca são cortadas: a largura do bloco de fotos de cada página é calculada a partir
das proporções reais (`photoBlock` em `js/catalog-core.js`), com altura fixa de 175 mm.
O PDF precisa ficar abaixo de 10 MB para o WhatsApp: `optimize-images.py` limita a foto principal a 1200 px e os detalhes a 1000 px.

## Testes
```
node --test tests/catalog-core.test.js
python3 -I tests/test_optimize_images.py
python3 -I tests/test_screen.py
python3 -I tests/test_layout.py
python3 -I scripts/verify-pdf.py
```
