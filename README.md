# Tic Tac Miao

Un gioco per imparare la tastiera, le lettere e i primi conti, con Maci, Piumi, Emma e tutta la famiglia (gli stessi personaggi di [Maci e Piumi](https://simoz.github.io/mp/)).

Maci e Piumi camminano sulla tastiera: ogni tasto giusto fa succedere qualcosa.

## Missioni
1. **Il computer di zio Simone**: i robottini scappano dal computer, ognuno con una lettera (A E I O U). Si preme la stessa lettera e il robottino torna a casa. Alla fine quattro robottini scrivono MIAO.
2. …8. in arrivo: lettere, sillabe, contare, più, meno, parole, dettato.

## Come si gioca
- Si gioca con la tastiera vera; sullo schermo c'è la stessa tastiera, colorata per dito (mignolo rosa, anulare giallo, medio verde, indici azzurro e viola, pollici arancio). Su F e J ci sono le zampette, come le tacche dei tasti veri.
- Il tasto giusto brilla. Con **zampa piccola** brilla subito, con **zampa media** e **zampa grande** dopo qualche secondo. Il gioco cambia zampa da solo in base a come va.
- Gli errori non tolgono niente: il tasto trema e dopo due errori la lettera viene ripetuta a voce.
- INVIO va avanti nei dialoghi. Nel menu si sceglie la missione con il numero.
- Sul tablet si possono toccare i tasti disegnati.

## File
- `src/motore.js`: schermo, audio, voci, dialoghi, salvataggi
- `src/personaggi.js`: i personaggi, copiati da Maci e Piumi
- `src/tastiera.js`: la tastiera italiana disegnata
- `src/intro.js`: Maci e Piumi scrivono TIC TAC MIAO camminando sui tasti
- `src/missione1.js`: il computer di zio Simone
- `src/avvio.js`: schermate e ciclo del gioco
- `build.sh`: unisce `src/` in `index.html`

## Crediti
- Musica provvisoria: "Meow" (intro) e "Cozy Computer Corner" (zio Simone) da Maci e Piumi, create con [Suno](https://suno.com)
- Voce di zio Simone: Microsoft Diego (edge-tts); lettere: Microsoft Elsa (edge-tts)
- Font: [Fredoka](https://fonts.google.com/specimen/Fredoka)
