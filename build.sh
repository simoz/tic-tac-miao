#!/bin/bash
# Unisce src/ in index.html (GitHub Pages)
set -e
cd "$(dirname "$0")"
python3 - <<'PY'
js="".join(open(f"src/{f}.js").read()+"\n" for f in ["voci","motore","personaggi","tastiera","icone","quiz","intro","missione1","missione2","missione3","missione4","missione5","avvio"])
page=open("src/page.html").read().replace("/*SCRIPTS*/","(()=>{\n"+js+"})();")
head=('<!doctype html>\n<html lang="it">\n<head>\n<meta charset="utf-8">\n'
 '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
 '<meta name="description" content="Tic Tac Miao: Maci e Piumi camminano sulla tastiera. Un gioco per imparare lettere, parole e numeri.">\n</head>\n<body>\n')
open("index.html","w").write(head+page+"\n</body>\n</html>\n")
PY
echo "Creato index.html"
