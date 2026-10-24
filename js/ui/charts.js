const config={responsive:true,displaylogo:false,modeBarButtonsToRemove:['lasso2d','select2d']};
const layout=(yTitle)=>({margin:{l:60,r:22,t:25,b:54},paper_bgcolor:'#fff',plot_bgcolor:'#fff',font:{family:'-apple-system, Segoe UI, sans-serif',color:'#647086',size:12},xaxis:{title:'Номер шага',gridcolor:'#edf0f5',zeroline:false},yaxis:{title:yTitle,gridcolor:'#edf0f5',zeroline:false},showlegend:false,hovermode:'closest',uirevision:'keep-zoom'});
const line=(x,y,color,name)=>({x,y,type:'scattergl',mode:'lines+markers',name,line:{color,width:2.3},marker:{size:4,color},hovertemplate:'Шаг %{x}<br>Значение %{y:.9g}<extra></extra>'});
export class Charts {
 constructor(){this.available=typeof window.Plotly!=='undefined';this.sum=document.getElementById('sumChart');this.err=document.getElementById('errorChart');this.over=document.getElementById('overshootChart');this.reset()}
 reset(){this.points=[{step:0,after:0,error:null}];this.crossings=[];this.mode='finite';this.target=0;this.epsilon=.01;this.pending=false;this.lastPaint=0}
 configure(mode,target,epsilon){this.reset();this.mode=mode;this.target=target;this.epsilon=epsilon;this.render()}
 add(r){this.points.push(r);if(r.crossing)this.crossings.push(r.crossing)}
 render(){if(!this.available){for(const el of [this.sum,this.err,this.over])el.textContent='График недоступен: не загрузилась библиотека Plotly. Проверьте интернет.';return}
  const max=1600,stride=Math.max(1,Math.ceil(this.points.length/max));const sampled=this.points.filter((_,i)=>i%stride===0||i===this.points.length-1);const xs=sampled.map(p=>p.step),ys=sampled.map(p=>p.after);
  const l=layout('Sₙ');if(this.mode==='finite'){l.shapes=[{type:'rect',xref:'paper',x0:0,x1:1,y0:this.target-this.epsilon,y1:this.target+this.epsilon,fillcolor:'#6556c914',line:{width:0},layer:'below'},{type:'line',xref:'paper',x0:0,x1:1,y0:this.target,y1:this.target,line:{color:'#6556c9',width:2,dash:'dash'}}];}
  window.Plotly.react(this.sum,[line(xs,ys,'#159c8e','Sₙ')],l,config);
  if(this.mode!=='finite'){this.err.innerHTML='<p class="hint">Для режима ±∞ ошибка относительно конечного L не определена.</p>';this.over.innerHTML='<p class="hint">Перескоки через конечную цель определены только в режиме L ∈ ℝ.</p>';return}
  const e=layout('|Sₙ − L|');e.shapes=[{type:'line',xref:'paper',x0:0,x1:1,y0:this.epsilon,y1:this.epsilon,line:{color:'#159c8e',dash:'dash'}}];
  window.Plotly.react(this.err,[line(xs.slice(1),sampled.slice(1).map(p=>p.error),'#6556c9','Ошибка')],e,config);
  const os=this.crossings;const o=layout('Перескок');o.xaxis.title='Номер пересечения';
  window.Plotly.react(this.over,[line(os.map(c=>c.number),os.map(c=>c.overshoot),'#e47767','Перескок')],o,config);
 }
}
