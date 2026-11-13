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

Os botões "Pedir a …" continuam clicáveis no PDF.

**Por script (confere o resultado):** `python3 -I scripts/verify-pdf.py` gera
`dist/catalogo-guirlandas-natal-2026.pdf` e confere páginas A4, links do WhatsApp, fotos, textos e peso.

## Como atualizar
Tudo que muda fica em `js/data.js`:
- **Preço, tamanho, nome ou WhatsApp:** edite o item em `products` (ou `whatsapp`).
- **Novo produto:** coloque as 3 fotos em `/mnt/user-data/uploads` no padrão
  `[id]-[nome]-full.png`, `-detail1.png`, `-detail2.png`, rode
  `python3 -I scripts/optimize-images.py` e acrescente um item em `products`
  (com `photos("[id]-[nome]", [[w,h],[w,h],[w,h]])` — larguras/alturas dos JPEGs gerados).
  Produto sem as 3 fotos é ignorado, sem quebrar nada.
- **Nova linha (ex.: Escapulários):** acrescente em `lines` e use o mesmo `line` nos produtos;
  para um tema novo, crie `css/theme-<nome>.css` seguindo `theme-palha.css`.

As fotos nunca são cortadas: a largura do bloco de fotos de cada página é calculada a partir
das proporções reais (`photoBlock` em `js/catalog-core.js`), com altura fixa de 175 mm.

## Testes
```
node --test tests/catalog-core.test.js
python3 -I tests/test_optimize_images.py
python3 -I tests/test_screen.py
python3 -I scripts/verify-pdf.py
```
