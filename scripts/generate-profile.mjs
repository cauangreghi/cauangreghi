// npm install sharp
// node scripts/generate-profile.mjs [source.png] [output-directory]
// Source: https://avatars.githubusercontent.com/u/112584856?v=4
import fs from 'node:fs/promises';
import sharp from 'sharp';
const input=process.argv[2] || './assets/source-avatar.png';
const out=process.argv[3] || './assets';
const source=await fs.readFile(input);
// Sample the entire square avatar. No rotation, masking, or uneven crop.
const pixels=await sharp(source).resize(140,70,{fit:'fill'}).removeAlpha().raw().toBuffer();
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const bio=[["OS","Backend, Dados & IA"],["Host","GVC Soluções em Cobrança"],["Uptime","~7 anos de experiência"],["Kernel","Python · Go · C#/.NET"],["Shell","FastAPI · LangGraph"],["",""],["Location","Brazil"],["Education","Eng. de Computação"],["","UNIVESP"],["",""],["Cloud","S3 · Glue · Athena · Iceberg"],["AI / LLM","LangGraph · Anthropic SDK"]];
const portrait=[];
const card=function card(theme){var dark=theme==='dark';var bg=dark?'#0d1117':'#ffffff',fg=dark?'#d0d7de':'#24292f',muted=dark?'#8b949e':'#57606a',accent=dark?'#79c0ff':'#0969da';return `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1100" viewBox="0 0 1440 1100" role="img" aria-labelledby="title desc"><title id="title">Cauan Gregui Vivan — Backend, Dados e IA</title><desc id="desc">Retrato em caracteres ASCII convertido da foto de Cauan, ao lado de um perfil em estilo terminal.</desc><rect width="1440" height="1100" rx="18" fill="${bg}"/><g font-family="DejaVu Sans Mono,Consolas,monospace" font-size="12" fill="${fg}" xml:space="preserve">${portrait.map((l,i)=>`<text x="24" y="${48+i*15.4}">${esc(l)}</text>`).join('')}</g><g font-family="DejaVu Sans Mono,Consolas,monospace"><text x="760" y="170" font-size="30" fill="${accent}">cauan@dev</text><text x="760" y="208" font-size="17" fill="${muted}">────────────────────────────────────</text>${bio.map((p,i)=>`<text x="760" y="${254+i*33}" font-size="18"><tspan fill="${accent}">${esc(p[0])}${p[0]?': ':''}</tspan><tspan fill="${fg}">${esc(p[1])}</tspan></text>`).join('')}<text x="760" y="730" font-size="18" fill="${muted}">— Contact —</text><text x="760" y="774" font-size="18" fill="${fg}">cauangreghi@gmail.com</text><text x="760" y="812" font-size="18" fill="${fg}">linkedin.com/in/cauangregui</text><text x="760" y="850" font-size="18" fill="${fg}">@cauangregui_</text></g></svg>`;};

const portraitV3=function portraitV3(pixels){let parts=['<g font-family="Consolas,DejaVu Sans Mono,monospace" font-size="8.3" font-weight="bold"><rect x="24" y="155" width="700" height="700" rx="10" fill="#07171b"/>'];for(let y=0;y<70;y++){let spans=[];for(let x=0;x<140;x++){let i=(y*140+x)*3;let color='#'+[0,1,2].map(k=>Math.round(Math.min(255,pixels[i+k]*1.4)).toString(16).padStart(2,'0')).join('');spans.push(`<tspan x="${24+x*5}" fill="${color}">@</tspan>`);}parts.push(`<text y="${155+(y+.84)*10}">${spans.join('')}</text>`);}return parts.join('')+'</g>';};
const art=portraitV3(pixels);
function render(dark){return card(dark?'dark':'light').replace(/<g font-family="DejaVu Sans Mono,Consolas,monospace" font-size="12"[\s\S]*?<\/g>/,art).replaceAll('font-size="18"><tspan','font-size="18" xml:space="preserve"><tspan');}
await fs.mkdir(out,{recursive:true});
await fs.writeFile(out+'/profile-dark.svg',render(true));
await fs.writeFile(out+'/profile-light.svg',render(false));
// A plain-text density rendition is retained for terminal use.
const gray=await sharp(source).resize(140,70,{fit:'fill'}).greyscale().raw().toBuffer();
const ramp='@%#*+=-:. ';
const lines=Array.from({length:70},(_,y)=>Array.from({length:140},(_,x)=>ramp[Math.round(gray[y*140+x]/255*(ramp.length-1))]).join(''));
await fs.writeFile(out+'/portrait.txt',lines.join('\n')+'\n');
