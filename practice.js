const KP=(()=>{const IDS=[14,15,16],W=760,H=260;let seed=1,C,E,S,T,rev;
const rnd=n=>{let s=n*7919%2147483647||1;return()=>(s=s*16807%2147483647)/2147483647};
function gen(){const r=rnd(seed+11);let p=50;C=[];for(let i=0;i<20;i++){const d=i<14?.45:(r()-.5)*1.6,o=p,c=p+d+(r()-.5)*4;p=c;C.push([o,Math.max(o,c)+r()*1.6,Math.min(o,c)-r()*1.6,c])}
 E=Math.round(C[13][3]*2)/2;S=E-3;T=E+4.5;rev=false}
const hist=()=>C.slice(0,14),lo=()=>Math.floor(Math.min(...C.flat()))-2,hi=()=>Math.ceil(Math.max(...C.flat()))+2;
const atr=()=>hist().reduce((a,c)=>a+c[1]-c[2],0)/14;
function draw(){const mn=lo(),mx=hi(),y=v=>10+(mx-v)/(mx-mn)*(H-20),cw=(W-30)/20,x=i=>10+cw*(i+.5),n=rev?20:14;let o=`<rect width="${W}" height="${H}" fill="#09111e"/>`;
 const x0=x(13),x1=x(n-1)+cw/2,box=(a,b,f)=>`<rect x="${x0}" y="${y(Math.max(a,b))}" width="${x1-x0}" height="${Math.abs(y(a)-y(b))}" fill="${f}" fill-opacity=".2"/>`;
 if(S<E&&E<T)o+=box(E,T,'#45d6c6')+box(E,S,'#ff7a90');
 C.slice(0,n).forEach((c,i)=>{const f=c[3]>=c[0]?'#45d6c6':'#ff7a90';o+=`<line x1="${x(i)}" x2="${x(i)}" y1="${y(c[1])}" y2="${y(c[2])}" stroke="${f}" stroke-width="2"/><rect x="${x(i)-cw*.25}" y="${y(Math.max(c[0],c[3]))}" width="${cw*.5}" height="${Math.max(2,Math.abs(y(c[0])-y(c[3])))}" fill="${f}"/>`});
 [[E,'#f6b95b','Вход'],[S,'#ff7a90','Стоп'],[T,'#45d6c6','Цель']].forEach(([v,f,l])=>o+=`<line x1="10" x2="${W-10}" y1="${y(v)}" y2="${y(v)}" stroke="${f}" stroke-dasharray="6 5" stroke-width="1.5"/><text x="${W-14}" y="${y(v)-5}" text-anchor="end" font-size="11" fill="${f}">${l} ${v}</text>`);
 return`<svg class="lesson-chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Тренажёр сделки">${o}</svg>`}
function nums(){if(!(S<E&&E<T))return'<p>Для покупки нужно: стоп &lt; вход &lt; цель.</p>';const k=E-S,rr=(T-E)/k;return`<p>Риск <b>$10</b> (1% от $1000) · расстояние до стопа <b>${k.toFixed(1)}</b> · объём <b>${(10/k).toFixed(2)}</b> ед. · RR <b>1:${rr.toFixed(2)}</b></p>`}
function judge(){if(!(S<E&&E<T))return nums();const sw=Math.min(...C.slice(8,14).map(c=>c[2])),k=E-S,rr=(T-E)/k,mh=Math.max(...hist().map(c=>c[1])),a=atr();
 const ch=[[S<sw,'Стоп стоит за последним минимумом ('+sw.toFixed(1)+')'],[k>=a,'Стоп не уже обычного хода свечи (≈'+a.toFixed(1)+')'],[rr>=1.5,'RR не ниже 1:1,5'],[T<=mh+a,'Цель не дальше прежнего максимума ('+mh.toFixed(1)+') более чем на ход свечи']];
 return`<ul class="kpl">${ch.map(c=>`<li class="${c[0]?'y':'n'}">${c[0]?'✓':'✗'} ${c[1]}</li>`).join('')}</ul><p><b>${ch.filter(c=>c[0]).length} из 4.</b> Критерии учебные: у реальной стратегии они свои.</p>`}
function after(){if(!(S<E&&E<T))return nums();rev=true;let f=-1,res='';for(let i=14;i<20;i++){const c=C[i];if(f<0){if(c[2]<=E&&E<=c[1])f=i;else continue}
  if(c[2]<=S){res=`Стоп сработал: <b>−1R (−$10)</b>.`;break}if(c[1]>=T){const r=(T-E)/(E-S);res=`Цель достигнута: <b>+${r.toFixed(2)}R (+$${(10*r).toFixed(0)})</b>.`;break}}
 if(f<0)res='Вход не исполнился: цена не дошла до уровня. Так бывает с лимитными заявками.';else if(!res){const r=(C[19][3]-E)/(E-S);res=`Ни стоп, ни цель не сработали. По закрытию последней свечи: <b>${r>=0?'+':''}${r.toFixed(2)}R</b>.`}
 return`<p>${res} Один исход ничего не доказывает: оценивай процесс, а не результат сделки.</p>`}
function html(id){return IDS.includes(id)?`<div class="kp" id="kp"><h3>Практика: собери план сделки</h3><p class="muted">Покупка. Двигай вход, стоп и цель, затем оцени план и посмотри, что было дальше. Данные учебные.</p><div id="kpChart"></div>${[['E','Вход'],['S','Стоп'],['T','Цель']].map(([k,l])=>`<label>${l}: <b id="kv${k}"></b><input type="range" data-k="${k}" step=".5"></label>`).join('')}<div id="kpOut"></div><div class="row"><button type="button" class="secondary" id="kpJudge">Оценить план</button><button type="button" class="secondary" id="kpNext">Что было дальше?</button><button type="button" class="secondary" id="kpNew">Новый сценарий</button></div></div>`:''}
function wire(){const k=document.getElementById('kp');if(!k)return;gen();const R=[...k.querySelectorAll('input')],ch=document.getElementById('kpChart'),out=document.getElementById('kpOut');
 const sync=()=>{R.forEach(r=>{r.min=lo();r.max=hi();r.value={E,S,T}[r.dataset.k];document.getElementById('kv'+r.dataset.k).textContent=r.value})};
 const up=m=>{ch.innerHTML=draw();out.innerHTML=m||nums()};
 R.forEach(r=>r.oninput=()=>{const v=+r.value;({E:()=>E=v,S:()=>S=v,T:()=>T=v})[r.dataset.k]();document.getElementById('kv'+r.dataset.k).textContent=v;rev=false;up()});
 document.getElementById('kpJudge').addEventListener('click',()=>up(judge()));document.getElementById('kpNext').addEventListener('click',()=>up(after()));
 document.getElementById('kpNew').addEventListener('click',()=>{seed++;gen();sync();up()});sync();up()}
return{html,wire}})();
