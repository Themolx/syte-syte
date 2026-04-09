# SYTĚ SYTĚ — virtuální zin (v2)

## Kontext

Jednostránkový web-zin prezentující found poetry extrahovanou z AI-generovaného textu. Původ: Gemini deep research dotaz na referenční galerie pro projekt Tram Gallery / Galerie Označník. Model ztratil vnitřní stop signál a místo rešerše vyprodukoval tok přívlastků. Úryvky jsou extrahovány beze změn.

Forma zrcadlí obsah: text o přeplněných reklamních plochách, vyprodukovaný systémem trpícím formou přesycení. Sbírka má být brutálně minimální vizuálně, aby kontrast s obsahem byl maximální.

**Data:** `psycho-llm-data.json` — 9 záznamů, každý má `noun`, `text`, `glitch_notes`, `repetitions`, `adjective_count`, případně `medal`.

**Cíl:** statický web, deploy jako GitHub Pages repo. Žádný build step.

## Estetika — NON-NEGOTIABLE

- **Pouze černá a bílá.** `#000` a `#FFF`. Nic mezi. Žádná šedá kromě případných `rgba(0,0,0,0.X)` pro velmi jemné overlays pokud to animace potřebuje. Žádná akcentní barva.
- **Helvetica.** `font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;`. Žádné Google Fonts, žádné mono fonty, žádné custom fonty. System stack.
- **Bold.** Primárně weight 700–900. Všechno velké a tučné. Thin weights jen pro drobné popisky (captions, kolofon).
- **Hranaté.** `border-radius: 0` všude. Žádné zaoblení.
- **Žádné shadows, gradienty, glow, blur efekty.** Absolutně nic z "AI aesthetic".
- **Grid a typografie jsou veškerá dekorace.** Swiss design, Experimental Jetset, Wim Crouwel, Karel Martens. Ruscha typografické práce.

## Struktura

Jednostránkový vertikální scroll. Každá sekce zabírá `min-height: 100vh`. Pořadí dle `id` v JSONu (00 → 08).

### Obálka

- Obří titul **SYTĚ SYTĚ** — maximální velikost, bold, vycentrovaný nebo zarovnaný vlevo na celou šířku (`font-size: clamp(80px, 15vw, 300px)`)
- Podtitul: *Found poetry z jazykového modelu v záchvatu*
- Dole malým písmem kontext: text přibližně ve znění „Vzniklo jako vedlejší produkt deep research dotazu na referenční galerie pro projekt Galerie Označník. Model ztratil vnitřní stop signál."
- Počet záznamů: `09`
- Indikace scroll (šipka dolů nebo slovo "DOLŮ")

### Sekce záznamu

Layout brutalistní, typografický:

- **Číslo** velké vlevo nahoře: `01` (rozměr jako sub-hero, bold)
- **Lomítko s celkem** malé vedle: `/ 09`
- **Kategorie / medaile** velkými caps malými: `BRONZ — BYROKRATICKÝ ZÁCHVAT`
- **Podstatné jméno** OBŘÍ, bold, jako titul sekce: `STATUS` (nebo lowercase `status`, rozhodni se podle toho co vypadá brutálnější — preferuj lowercase jako kontrast k caps titlu SYTĚ SYTĚ)
- **Počet přívlastků** malým popiskem: `38 PŘÍVLASTKŮ`
- **Tělo textu** vysázené jako velký blok textu, generózní line-height (1.3–1.5), šířka omezená na ~70–80ch pro čitelnost. Samotné podstatné jméno v textu vyznačené (inverzní — bílý text na černém pozadí nebo silně tučný s podtržením).
- **Glitch notes** pod textem menším bold textem jako kurátorský popisek

## Animace — to je klíčová část

Animace musí **ztělesňovat problém samotného textu**: běh bez brzdy, akumulaci bez ekonomie, selhání stop signálu. Nesmí to být dekorativní animace typu "fade in pro fade in". Musí mít konceptuální smysl.

### Primární animační princip: TYPEWRITER AKUMULACE

Když sekce vstoupí do viewportu (IntersectionObserver), tělo textu se **nevyvolá najednou**. Začne se psát slovo po slovu, rychlostí která **postupně akceleruje**. První 3–4 přívlastky pomalu, potom čím dál rychleji, až na konci se sype text jako vodopád. Jako by model sám ztrácel kontrolu v reálném čase před očima čtenáře.

- Začátek: ~300ms na slovo
- Konec: ~30ms na slovo
- Easing: zrychlující exponenciála, ne lineární

Podstatné jméno na konci textu (cíl celé věty) dopadne s pauzou — jako rána. Trochu delší delay před ním, pak se objeví v plné velikosti invertované.

### Sekundární: POČÍTADLO OPAKOVÁNÍ

Pro slova s vysokým počtem v `repetitions` — každé další opakování má vedle sebe malý superscript čítač. "záchranné¹", "záchranné²", ... "záchranné⁷". Objevují se postupně jak text přibývá při typewriter animaci. Je to jemné ale po několika sekcích čtenář začne vnímat vzorec.

### Fixed UI prvek: GLOBÁLNÍ ČÍTAČ PŘÍVLASTKŮ

V rohu (fixed position, např. bottom-right) velký bold čítač:

```
288
PŘÍVLASTKŮ
```

Inkrementuje se v reálném čase s typewriter animací napříč všemi sekcemi. Jak scrolluješ dolů a text se píše, čítač roste. Dosažitelné maximum = součet všech `adjective_count` (288). Je to ten vtip o tíži textu, ale teď viditelný a dynamický.

### Scroll-based parallax — JEN V JEDNOM MÍSTĚ

Pro sekci **05 BUDKY** (60 přívlastků, největší blok) udělej výjimku: text se nepíše typewriterem, ale scrolluje rychleji než zbytek stránky. Sekce je vysoká `200vh` a text se vertikálně posouvá uvnitř fixed containeru. Je to vizuální zátěž, přehlcení, ta jedna sekce kde čtenáře masa přívlastků fyzicky zabaví. Pak pokračuje normál.

### Žádné jiné animace

Ne hover efekty, ne parallax na obrázcích (obrázky nejsou), ne scroll-indicator progress bary. Výše uvedené stačí.

## Interakce

- **Scroll** je primární navigace
- **Šipky ↑↓** a **PgUp/PgDn** skáčou mezi sekcemi (scroll-snap nebo smooth scroll)
- **Top nav** fixed horní lišta s čísly 00 01 02 03 04 05 06 07 08 jako klikací čísla, aktuální sekce tučnější. Čísla bold, Helvetica, černá na bílé, oddělená jen mezerami.
- **Žádná boční navigace.** Jen top.

## Kolofon (poslední sekce)

- Velký text **KOLOFON** jako hero
- Data z `colophon` v JSONu
- Věta: "Edice: virtuální, nekonečná"
- Odkaz na GitHub repo (placeholder `https://github.com/Themolx/syte-syte`)
- Věta o licenci nebo anti-licenci (např. "Odpad nemůže být vlastněn.")
- Kontaktní řádek nebo nic

## Technické požadavky

- **Single `index.html`** + `psycho-llm-data.json` + případně `style.css` a `script.js` (klidně oddělit, je to jednodušší pro GH Pages a editaci)
- **Vanilla JS.** Žádné frameworks, žádné bundlery, žádné npm. IntersectionObserver, `requestAnimationFrame`, `fetch`.
- **Fetch JSONu** funguje na GH Pages standardně. Není potřeba embed fallback.
- **Responsive**: funguje od 360px výš. Na mobilu typewriter animace běží rychleji (menší text, kratší čtení). Globální čítač menší na mobilu.
- **GitHub Pages ready**: struktura repa `index.html`, `style.css`, `script.js`, `psycho-llm-data.json`, `README.md`. Nic víc, žádné `docs/`, žádné `build/`.
- **Accessibility**: sémantické HTML, headings hierarchy, prefers-reduced-motion respektováno — pokud uživatel má reduced-motion, typewriter animace se vypne a text se zobrazí rovnou (ale ten vtip se ztratí, to je daň).

## Co NEDĚLAT

- Žádná jiná barva než čistá černá a čistá bílá
- Žádný jiný font než Helvetica stack
- Žádné obrázky, ikony, emoji, SVG ilustrace
- Žádné rounded corners, shadows, gradienty
- Nepřekládat texty do angličtiny — česky zůstává česky
- Neopravovat gramatiku v datech — to JE obsah
- Žádné analytiky, žádné tracking pixely (ironicky vzhledem k tématu)
- Žádný README bloat — krátký, věcný

## Deliverable

1. `index.html`
2. `style.css`
3. `script.js`
4. `psycho-llm-data.json` (zkopíruj z existujícího)
5. `README.md` — krátké: co to je, jak spustit lokálně (`python -m http.server`), jak deployovat na GH Pages, jak upravit data
6. `.gitignore` — standardní pro statický web

## Postup

1. Přečti `psycho-llm-data.json`
2. Rozvrhni HTML strukturu (hero, 9 sekcí, kolofon, fixed top nav, fixed čítač)
3. CSS: nastav Helvetica stack, B/W, bold weights, grid/flex layout, responsive
4. JS: načti JSON, vygeneruj sekce dynamicky, IntersectionObserver pro typewriter, akumulátor pro globální čítač, scroll-snap pro sekci 05
5. Otestuj v browseru lokálně
6. Napiš README

Pokud něco není jasné, rozhoduj směrem k **větší brutalitě, méně efektů, více whitespace**.
