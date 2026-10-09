# Tic Tac Miao

Un gioco per imparare la tastiera, le lettere e i primi conti, con Maci, Piumi, Emma e tutta la famiglia (gli stessi personaggi di [Maci e Piumi](https://simoz.github.io/mp/)).

Maci e Piumi camminano sulla tastiera: ogni tasto giusto fa succedere qualcosa.

## Missioni
Ogni missione ha tre turni e una musica di un genere diverso.
1. **Il computer di zio Simone** (A E I O U, chiptune): i robottini scappano dal computer, ognuno con una vocale. Alla fine quattro robottini scrivono MIAO.
2. **I libri di nonna Luisa** (le lettere, swing jazz): cadono i libri, ognuno con una consonante e una figura (M come MELA). Alla fine si scrive NONNA.
3. **I gomitoli di Emma** (le sillabe, valzer con la fisarmonica): MA ME MI MO MU, poi PA, LA, TA…, poi le parole MELA, LUNA, SOLE. Con ogni gomitolo cresce la sciarpa per Margherita.
4. **L'orto di zio Giulio** (contare, bluegrass): quante carote? Si preme il numero, poi le carote si contano a voce mentre saltano nel cesto. Alla fine i pomodori.
5. **Il pollaio di zia Mile** (più, funk): 2 uova nel nido, la gallina ne fa altre 3: quante in tutto?

Dopo due errori il personaggio aiuta: ripete la lettera, o conta insieme le carote e le uova una per una.

## Come si gioca
- Si gioca con la tastiera vera; sullo schermo c'è la stessa tastiera, colorata per dito (mignolo rosa, anulare giallo, medio verde, indici azzurro e viola, pollici arancio). Su F e J ci sono le zampette, come le tacche dei tasti veri.
- Il tasto giusto brilla. Con **zampa piccola** brilla subito, con **zampa media** e **zampa grande** dopo qualche secondo. Il gioco cambia zampa da solo in base a come va.
- Gli errori non tolgono niente: il tasto trema e dopo due errori la lettera viene ripetuta a voce.
- INVIO va avanti nei dialoghi. Nel menu si sceglie la missione con il numero.
- Sul tablet si possono toccare i tasti disegnati.

## File
- `src/voci.js`: tutte le frasi dei personaggi e le parole lette ad alta voce
- `src/motore.js`: schermo, audio, voci, dialoghi, salvataggi
- `src/personaggi.js`: i personaggi, copiati da Maci e Piumi
- `src/tastiera.js`: la tastiera italiana disegnata
- `src/intro.js`: Maci e Piumi scrivono TIC TAC MIAO camminando sui tasti
- `src/icone.js`: le figure (mela, palla, luna…), gomitoli, uova, cesti
- `src/quiz.js`: il giro comune delle missioni 2–5 (turni, aiuti, zampe, stelle)
- `src/missione1.js` … `src/missione5.js`: le missioni
- `src/avvio.js`: schermate e ciclo del gioco
- `build.sh`: unisce `src/` in `index.html`
- `genera-voci.sh`: genera con edge-tts le frasi e le parole che mancano

## Crediti
- Musiche create con [Suno](https://suno.com): intro provvisoria ("Meow" da Maci e Piumi), m1–m5 per le missioni
- Voci con edge-tts: zio Simone (Diego), nonna Luisa e zia Mile (Isabella), zio Giulio (Giuseppe), lettere e numeri (Elsa). Le frasi già presenti in Maci e Piumi sono le stesse.
- Voce di Emma: le frasi di Maci e Piumi sono fatte con [ElevenLabs](https://elevenlabs.io); quelle nuove per ora sono provvisorie (Elsa)
- Font: [Fredoka](https://fonts.google.com/specimen/Fredoka)
