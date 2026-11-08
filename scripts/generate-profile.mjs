// npm install sharp
// node generate-profile.mjs /path/to/portrait.png ./assets
import fs from 'node:fs/promises';
import sharp from 'sharp';
const input=process.argv[2];
if(!input) throw new Error('Provide the source portrait PNG path.');
const png=await fs.readFile(input);
const out=process.argv[3] || './assets';
const ramp=" .,:;irsXA253hMHGS#9B&@";
const poly=[[410,47],[533,33],[665,65],[722,113],[733,190],[718,305],[714,374],[722,406],[715,469],[700,522],[692,611],[678,647],[703,679],[810,750],[810,920],[175,920],[175,840],[263,783],[321,728],[330,705],[317,645],[294,577],[270,518],[241,514],[225,475],[222,406],[239,365],[242,230],[262,168],[320,105]];
const bio=[["OS","Backend, Dados & IA"],["Host","GVC Soluções em Cobrança"],["Uptime","~7 anos de experiência"],["Kernel","Python · Go · C#/.NET"],["Shell","FastAPI · LangGraph"],["",""],["Location","Brazil"],["Education","Eng. de Computação"],["","UNIVESP"],["",""],["Cloud","S3 · Glue · Athena · Iceberg"],["AI / LLM","LangGraph · Anthropic SDK"]];
const inside=function inside(x,y){var c=false; for(var i=0,j=poly.length-1;i<poly.length;j=i++){var a=poly[i],b=poly[j];if(((a[1]>y)!=(b[1]>y))&&(x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]))c=!c;}return c;};
const esc=function esc(s){return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');};
const buildPortrait=async function(dark){ var c={left:205,top:25,width:550,height:755},w=140,h=96;var pixels=await sharp(png).extract(c).resize(w,h,{fit:'fill'}).greyscale().raw().toBuffer();var lines=[];for(var y=0;y<h;y++){var l='';for(var x=0;x<w;x++){var v=Math.pow(Math.max(0,Math.min(1,(pixels[y*w+x]-5)/220)),.7);l+=inside(c.left+(x+.5)*c.width/w,c.top+(y+.5)*c.height/h)?ramp[Math.round((dark?.12+.88*v:1-v)*(ramp.length-1))]:' ';}lines.push(l);}return lines;};
const darkLines=await buildPortrait(true),lightLines=await buildPortrait(false);
const portrait=darkLines;
const card=function card(theme){var dark=theme==='dark';var bg=dark?'#0d1117':'#ffffff',fg=dark?'#d0d7de':'#24292f',muted=dark?'#8b949e':'#57606a',accent=dark?'#79c0ff':'#0969da';return `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1100" viewBox="0 0 1440 1100" role="img" aria-labelledby="title desc"><title id="title">Cauan Gregui Vivan — Backend, Dados e IA</title><desc id="desc">Retrato em caracteres ASCII convertido da foto de Cauan, ao lado de um perfil em estilo terminal.</desc><rect width="1440" height="1100" rx="18" fill="${bg}"/><g font-family="DejaVu Sans Mono,Consolas,monospace" font-size="12" fill="${fg}" xml:space="preserve">${portrait.map((l,i)=>`<text x="24" y="${48+i*15.4}">${esc(l)}</text>`).join('')}</g><g font-family="DejaVu Sans Mono,Consolas,monospace"><text x="760" y="170" font-size="30" fill="${accent}">cauan@dev</text><text x="760" y="208" font-size="17" fill="${muted}">────────────────────────────────────</text>${bio.map((p,i)=>`<text x="760" y="${254+i*33}" font-size="18"><tspan fill="${accent}">${esc(p[0])}${p[0]?': ':''}</tspan><tspan fill="${fg}">${esc(p[1])}</tspan></text>`).join('')}<text x="760" y="730" font-size="18" fill="${muted}">— Contact —</text><text x="760" y="774" font-size="18" fill="${fg}">cauangreghi@gmail.com</text><text x="760" y="812" font-size="18" fill="${fg}">linkedin.com/in/cauangregui</text><text x="760" y="850" font-size="18" fill="${fg}">@cauangregui_</text></g></svg>`;};
// Explicit x coordinates prevent font fallback from stretching the face.
// Display width/height exactly matches the original 550 x 755 crop.
const makeFinal=function(lines,dark){
  const displayWidth=700;
  const displayHeight=displayWidth*755/550;
  const cellWidth=displayWidth/140;
  const cellHeight=displayHeight/96;
  const xs=Array.from({length:140},(_,x)=>(24+x*cellWidth).toFixed(4)).join(' ');
  const group=`<g fill="${dark?'#d0d7de':'#24292f'}" font-family="Consolas,DejaVu Sans Mono,monospace" font-size="8.3" text-anchor="start" xml:space="preserve">${lines.map((line,y)=>`<text x="${xs}" y="${(55+(y+.5)*cellHeight+2.5).toFixed(4)}">${esc(line)}</text>`).join('')}</g>`;
  return card(dark?'dark':'light').replace(/<g font-family="DejaVu Sans Mono,Consolas,monospace" font-size="12"[\s\S]*?<\/g>/,group).replaceAll('font-size="18"><tspan','font-size="18" xml:space="preserve"><tspan');
};
await fs.mkdir(out,{recursive:true});
await fs.writeFile(out+'/profile-dark.svg',makeFinal(darkLines,true));
await fs.writeFile(out+'/profile-light.svg',makeFinal(lightLines,false));
await fs.writeFile(out+'/portrait.txt',lightLines.map(l=>l.trimEnd()).join('\n')+'\n');
