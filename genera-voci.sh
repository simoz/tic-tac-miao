#!/bin/bash
# Genera con edge-tts le frasi e le parole che mancano (non tocca i file che ci sono già).
# Frasi: audio/voce/<prefisso><numero>.mp3   Parole: audio/parole/<parola>.mp3
# Le liste sono in src/voci.js. Serve edge-tts:  python3 -m pip install edge-tts
# Uso: ./genera-voci.sh            (oppure EDGE_TTS=/percorso/edge-tts ./genera-voci.sh)
set -e
cd "$(dirname "$0")"
TTS=${EDGE_TTS:-edge-tts}
mkdir -p audio/voce audio/parole
# voce di ogni personaggio: voce Microsoft, tono, velocità (come in Maci e Piumi)
voce(){ case $1 in
  simone) echo "it-IT-DiegoNeural +0Hz +0%";;
  luisa)  echo "it-IT-IsabellaNeural -10Hz -12%";;
  emma)   echo "it-IT-ElsaNeural -12Hz -18%";;      # provvisoria: l'originale è fatta con ElevenLabs
  giulio) echo "it-IT-GiuseppeMultilingualNeural -6Hz -8%";;
  mile)   echo "it-IT-IsabellaNeural +0Hz -8%";;
  parole) echo "it-IT-ElsaNeural +15Hz -15%";;
esac; }
node -e '
const src=require("fs").readFileSync("src/voci.js","utf8");
const {PREFIX,LINES,PAROLE}=new Function(src+";return {PREFIX,LINES,PAROLE};")();
const slug=t=>t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
for(const who in LINES)LINES[who].forEach((t,i)=>console.log([who,"audio/voce/"+PREFIX[who]+String(i+1).padStart(2,"0")+".mp3",t.charAt(0)+t.slice(1).toLowerCase()].join("\t")));
PAROLE.forEach(t=>console.log(["parole","audio/parole/"+slug(t)+".mp3",t].join("\t")));
' | while IFS=$'\t' read -r who file text; do
  [ -f "$file" ] && continue
  read -r v p r <<<"$(voce "$who")"
  "$TTS" -v "$v" --pitch="$p" --rate="$r" -t "$text" --write-media "$file.tmp.mp3" 2>/dev/null
  # toglie il silenzio prima e dopo, così le parole arrivano subito
  ffmpeg -hide_banner -loglevel error -y -i "$file.tmp.mp3" -af "silenceremove=start_periods=1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse,apad=pad_dur=0.08" -b:a 64k "$file"
  rm "$file.tmp.mp3"
  echo "Creato $file  ($text)"
done
