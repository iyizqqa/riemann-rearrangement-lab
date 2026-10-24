const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const fmt=n=>Number(n.toPrecision(5)).toString();
/** Numeric x coordinate is exact to the displayed scale; arc height is illustrative. */
export function renderProof(svg,engine,last){
  const {mode,target}=engine.config;const isFiniteMode=mode==='finite';
  const recent=engine.crossings.slice(-14);
  const values=[0,engine.sum,...recent.flatMap(c=>[c.from,c.to])];if(isFiniteMode)values.push(target);
  else values.push((mode==='plus'?1:-1)*engine.stage);
  let low=Math.min(...values),high=Math.max(...values);const span=Math.max(high-low,.15);low-=span*.12;high+=span*.12;
  const x=n=>45+(n-low)/(high-low)*810;const y=150;
  let html=`<defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="#8994a6" stroke-width="1.4"/></marker></defs><line x1="30" y1="${y}" x2="870" y2="${y}" stroke="#a0a9b7" stroke-width="2" marker-end="url(#arrowhead)"/>`;
  const mark=(n,label,color)=>`<line x1="${x(n)}" y1="${y-8}" x2="${x(n)}" y2="${y+8}" stroke="${color}" stroke-width="2"/><text x="${x(n)}" y="${y+29}" fill="${color}" font-size="14" text-anchor="middle">${esc(label)}</text>`;
  html+=mark(0,'0','#778196');
  if(isFiniteMode){html+=`<line x1="${x(target)}" x2="${x(target)}" y1="30" y2="265" stroke="#6556c9" stroke-dasharray="5 5" opacity=".5"/>`;html+=mark(target,`L = ${fmt(target)}`,'#6556c9')}
  else html+=mark((mode==='plus'?1:-1)*engine.stage,`порог ${mode==='plus'?'+':'−'}${engine.stage}`,'#6556c9');
  recent.forEach((c,i)=>{const a=x(c.from),b=x(c.to),up=c.side>0,color=up?'#159c8e':'#e47767';const curve=up?70:-70;
    html+=`<path d="M${a},${y} C${a},${y-curve} ${b},${y-curve} ${b},${y}" fill="none" stroke="${color}" stroke-width="${i===recent.length-1?3.4:2.2}" opacity="${.42+.58*(i+1)/recent.length}" stroke-linecap="round"/><circle cx="${b}" cy="${y}" r="4" fill="${color}"/>`;
  });
  html+=`<circle cx="${x(engine.sum)}" cy="${y}" r="7" fill="#6556c9" stroke="white" stroke-width="3"/><text x="${x(engine.sum)}" y="${y-19}" fill="#6556c9" text-anchor="middle" font-size="13" font-weight="700">Sₙ</text>`;
  svg.innerHTML=html;
}
