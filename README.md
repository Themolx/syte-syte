# SYTĚ SYTĚ

Found poetry z jazykového modelu v záchvatu.

Virtuální zin. Extrahováno z AI-generovaného textu o Galerii Označník.

## Spuštění lokálně

```bash
cd literatura/
python -m http.server 8080
# → http://localhost:8080
```

Soubor musí být servován přes HTTP (ne `file://`) — potřebuje `fetch()` pro JSON.

## Deploy na GitHub Pages

1. Forknout nebo pushout obsah tohoto adresáře jako vlastní repo
2. Settings → Pages → Deploy from branch → `main` → `/ (root)`
3. Web bude na `https://username.github.io/syte-syte/`

## Úprava dat

Editovat `psycho-llm-data.json`:
- `entries[].text` — surový tok přívlastků (neupravovat, to JE obsah)
- `entries[].noun` — podstatné jméno, vyznačí se invertovaně v textu
- `entries[].repetitions` — mapa slovo→počet, přidá superscript čítač
- `entries[].adjective_count` — zahrnuto do globálního čítače

## Tisknutelná verze

Připravujeme. Plánovaný formát: A3, dvoustrana, černobílý offset.

## Struktura

```
index.html          shell, vše generuje JS
style.css           Helvetica, černobílá, brutalistní grid
script.js           fetch, typewriter, parallax, counter, navigace
psycho-llm-data.json  data
```
