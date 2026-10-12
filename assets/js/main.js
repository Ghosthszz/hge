/* HGE Iluminação — comportamento do site (menu, catálogo, orçamento, contato, produto) + efeitos visuais */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer=matchMedia('(hover:hover) and (pointer:fine)').matches;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- Ícones SVG (sem emoji) ---------- */
const P={wa:'<path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.5z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .7c-1-.4-2-1.4-2.4-2.4l.7-1-1-2z"/>',
mail:'<path d="M3 6h18v12H3zM3 7l9 7 9-7"/>',phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
spark:'<path d="M12 3l2.4 5.6L20 9.5l-4.4 3.8L17 19l-5-3-5 3 1.4-5.7L4 9.5l5.6-.9z"/>',layers:'<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
support:'<path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1zM17 19c0 1.5-2 2-5 2"/>',
bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',ur:'<path d="M7 17L17 7M8 7h9v9"/>',ar:'<path d="M5 12h14M13 6l6 6-6 6"/>',
plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
cart:'<path d="M3 4h2l2.5 10h10L20 7H6.5M9 20a1 1 0 1 0 0-.01M17 20a1 1 0 1 0 0-.01"/>'};
const ico=n=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
const GLYPH={'✦':'spark','◈':'layers','↗':'support','☼':'bolt','☎':'phone','◉':'wa','✉':'mail'};
document.documentElement.classList.add('js');
function decorate(root=document){
  $$('.trust-icon',root).forEach(e=>{const g=GLYPH[e.textContent.trim()];if(g)e.innerHTML=ico(g)});
  $$('.wa-float',root).forEach(e=>{if(!$('.ico',e))e.innerHTML=ico('wa')});
  $$('.btn,.nav-cta,.text-link',root).forEach(e=>{const t=e.lastChild;if(t&&t.nodeType===3){const m=t.nodeValue.match(/\s*([↗→])\s*$/);if(m){t.nodeValue=t.nodeValue.slice(0,m.index);e.insertAdjacentHTML('beforeend',ico(m[1]==='↗'?'ur':'ar'))}}});
  $$('[data-send-quote]',root).forEach(e=>{if(!$('.ico',e))e.insertAdjacentHTML('afterbegin',ico('wa'))});
}

/* ---------- Toast ---------- */
let toastEl,toastT;
function toast(msg){if(!toastEl){toastEl=document.createElement('div');toastEl.className='toast';toastEl.setAttribute('role','status');document.body.append(toastEl)}
  toastEl.innerHTML=ico('check')+'<span></span>';$('span',toastEl).textContent=msg;toastEl.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>toastEl.classList.remove('show'),3200)}

/* ---------- Menu ---------- */
const toggle=$('.menu-toggle'),nav=$('.nav-links');
if(toggle&&nav){
  toggle.innerHTML='<span class="bars" aria-hidden="true"><i></i><i></i><i></i></span>';
  const set=o=>{nav.classList.toggle('open',o);toggle.setAttribute('aria-expanded',String(o));toggle.setAttribute('aria-label',o?'Fechar menu':'Abrir menu')};
  toggle.addEventListener('click',()=>set(!nav.classList.contains('open')));
  $$('a',nav).forEach(a=>a.addEventListener('click',()=>set(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
  document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))set(false)});
  // marca o link da página atual
  const here=location.pathname.split('/').pop()||'index.html';
  $$('a',nav).forEach(a=>{const h=(a.getAttribute('href')||'').split('?')[0].split('/').pop();if(h&&h===here&&!a.classList.contains('nav-cta'))a.classList.add('active')});
}

/* ---------- Catálogo (busca + filtro) ---------- */
const catalog=$('[data-catalog]');
if(catalog){
  const search=$('[data-search]'),filter=$('[data-filter]'),cards=$$('.product-card',catalog),empty=$('[data-empty]');
  let count=null;
  if(search||filter){count=document.createElement('p');count.className='result-count';count.setAttribute('aria-live','polite');catalog.before(count)}
  const run=()=>{let n=0;const q=norm(search?.value);
    cards.forEach(c=>{const ok=norm(c.dataset.name).includes(q)&&(!filter?.value||c.dataset.category===filter.value);
      const was=c.style.display==='none';c.style.display=ok?'':'none';if(ok){n++;if(was&&!reduce){c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop')}}});
    if(empty)empty.style.display=n?'none':'block';
    if(count)count.textContent=n+(n===1?' produto encontrado':' produtos encontrados')};
  search?.addEventListener('input',run);filter?.addEventListener('change',run);if(count)run();
}

/* ---------- Lista de orçamento (local ao navegador) ---------- */
const CART_KEY='hge_quote_cart_v1';
const readCart=()=>{try{return JSON.parse(localStorage.getItem(CART_KEY)||'[]')}catch{return []}};
const saveCart=items=>{try{localStorage.setItem(CART_KEY,JSON.stringify(items))}catch{}};
const cartCount=()=>readCart().reduce((n,p)=>n+(Number(p.qty)||0),0);
const refreshCartBadge=bump=>{const n=cartCount();$$('[data-cart-count]').forEach(el=>{el.textContent=String(n);el.setAttribute('aria-label',n+' itens no orçamento');if(bump&&!reduce){el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')}})};
const addToQuote=name=>{const items=readCart(),found=items.find(p=>p.name===name);
  if(found)found.qty=Math.min(999,(Number(found.qty)||1)+1);else items.push({name,qty:1});
  saveCart(items);refreshCartBadge(true);
  const msg='“'+name+'” adicionado à lista de orçamento.',b=$('[data-cart-feedback]');
  if(b){b.textContent=msg;b.hidden=false;setTimeout(()=>{b.hidden=true},3500)}toast(msg)};
window.HGE={addToQuote};
const cartNav=$('.nav-links');
if(cartNav&&!cartNav.querySelector('[data-cart-link]')){
  const a=document.createElement('a'),sub=/\/(pages|politicas|produto)\//.test(location.pathname);
  a.href=(sub?'../':'')+'orcamento.html';a.className='cart-link';a.dataset.cartLink='';
  a.innerHTML=ico('cart')+'<span>Meu orçamento</span><span data-cart-count>0</span>';
  const cta=$('.nav-cta',cartNav);cta?cartNav.insertBefore(a,cta):cartNav.appendChild(a);
  if(/orcamento\.html$/.test(location.pathname))a.classList.add('active');
}
refreshCartBadge();
function bindQuoteButtons(root=document){$$('[data-quote]',root).forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';
  if(norm(b.textContent).includes('orcamento'))b.innerHTML=ico('plus')+'<span>Adicionar ao orçamento</span>';
  b.addEventListener('click',()=>{addToQuote(b.dataset.quote);if(b.classList.contains('added'))return;const h=b.innerHTML;b.classList.add('added');b.innerHTML=ico('check')+'<span>Adicionado</span>';setTimeout(()=>{b.classList.remove('added');b.innerHTML=h},1500)})})}
bindQuoteButtons();

let renderQuote=null;
const quoteList=$('[data-quote-list]');
if(quoteList){
  renderQuote=(animate=true)=>{const items=readCart();quoteList.innerHTML='';
    const empty=$('[data-quote-empty]'),actions=$('[data-quote-actions]');
    if(empty)empty.hidden=items.length>0;if(actions)actions.hidden=items.length===0;
    items.forEach((item,i)=>{
      const row=document.createElement('div');row.className='quote-row'+(animate&&!reduce?' new':'');row.style.animationDelay=(i*70)+'ms';
      const title=document.createElement('strong');title.textContent=item.name;
      const controls=document.createElement('div');controls.className='quote-controls';
      const setQty=v=>{items[i].qty=Math.max(1,Math.min(999,parseInt(v,10)||1));saveCart(items);renderQuote(false)};
      const minus=document.createElement('button');minus.type='button';minus.className='qty-btn';minus.innerHTML=ico('minus');minus.setAttribute('aria-label','Diminuir quantidade de '+item.name);minus.addEventListener('click',()=>setQty((Number(item.qty)||1)-1));
      const qty=document.createElement('input');qty.type='number';qty.min='1';qty.max='999';qty.value=String(item.qty||1);qty.setAttribute('aria-label','Quantidade de '+item.name);qty.addEventListener('change',()=>setQty(qty.value));
      const plus=document.createElement('button');plus.type='button';plus.className='qty-btn';plus.innerHTML=ico('plus');plus.setAttribute('aria-label','Aumentar quantidade de '+item.name);plus.addEventListener('click',()=>setQty((Number(item.qty)||1)+1));
      const remove=document.createElement('button');remove.type='button';remove.className='btn btn-dark';remove.textContent='Remover';
      remove.addEventListener('click',()=>{items.splice(i,1);saveCart(items);renderQuote(false)});
      controls.append(minus,qty,plus,remove);row.append(title,controls);quoteList.append(row)});
    refreshCartBadge()};
  renderQuote();
  $('[data-send-quote]')?.addEventListener('click',()=>{const items=readCart();if(!items.length)return;const f=$('[data-quote-customer]');if(f&&!f.reportValidity())return;const d=f?new FormData(f):null;
    const lines=items.map(p=>'- '+p.name+' | Quantidade: '+p.qty).join('\n');
    const msg='Olá, HGE Iluminação! Gostaria de solicitar um orçamento para os itens abaixo:\n\n'+lines+'\n\nNome: '+(d?.get('nome')||'Não informado')+'\nEmpresa: '+(d?.get('empresa')||'Não informado')+'\nCidade/UF: '+(d?.get('cidade')||'Não informado')+'\nObservações: '+(d?.get('observacoes')||'Não informado')+'\n\nPor favor, confirmem disponibilidade, especificações e condições comerciais.';
    window.open('https://wa.me/551126793996?text='+encodeURIComponent(msg),'_blank','noopener')});
  $('[data-clear-quote]')?.addEventListener('click',()=>{saveCart([]);renderQuote(false);toast('Lista de orçamento limpa.')});
}
addEventListener('storage',e=>{if(e.key===CART_KEY){refreshCartBadge();renderQuote&&renderQuote(false)}});

/* ---------- Formulário de contato ---------- */
const form=$('[data-contact-form]');
if(form)form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);
  const text=encodeURIComponent('Olá, HGE Iluminação!\nNome: '+d.get('nome')+'\nEmpresa: '+(d.get('empresa')||'Não informado')+'\nE-mail: '+d.get('email')+'\nTelefone: '+(d.get('telefone')||'Não informado')+'\nAssunto: '+d.get('assunto')+'\nMensagem: '+d.get('mensagem'));
  toast('Abrindo o WhatsApp com a sua mensagem…');window.open('https://wa.me/551126793996?text='+text,'_blank','noopener')});

/* ---------- Detalhe do produto ---------- */
const productData=window.HGE_PRODUCTS||[],params=new URLSearchParams(location.search),target=$('[data-product-detail]');
if(target){const p=productData.find(x=>x.id===params.get('id'))||productData[0];
  if(p){document.title=p.name+' | HGE Iluminação';
    const wa='https://wa.me/551126793996?text='+encodeURIComponent('Olá, HGE Iluminação! Gostaria de informações sobre: '+p.name);
    target.innerHTML=`<div class="big-image"><img data-main src="${esc(p.image)}" alt="${esc(p.name)}" referrerpolicy="no-referrer" onerror="if(this.dataset.fb){this.src=this.dataset.fb;this.dataset.fb=''}" data-fb="${esc(p.fallback||'')}" onload="this.classList.toggle('real-img',/^https?:/.test(this.currentSrc))">${p.gallery&&p.gallery.length>1?'<div class="thumbs">'+p.gallery.map((g,i)=>`<button type="button" class="${i?'':'on'}" data-thumb="${esc(g)}" aria-label="Ver foto ${i+1} de ${esc(p.name)}"><img src="${esc(g)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('button').hidden=true"></button>`).join('')+'</div>':''}</div><div><div class="breadcrumbs"><a href="../index.html">Início</a> / <a href="../loja.html">Loja</a> / ${esc(p.name)}</div><span class="pill">${esc(p.categoryLabel)}</span><h1 style="font-size:clamp(2rem,4vw,3rem);margin-top:15px">${esc(p.name)}</h1><p>${esc(p.description)}</p><p>Consulte disponibilidade, versões e condições comerciais com nossa equipe.</p><table class="specs"><tr><td>Categoria</td><td>${esc(p.categoryLabel)}</td></tr><tr><td>Modelo</td><td>${esc(p.model||'Consulte a equipe')}</td></tr><tr><td>Especificações</td><td>${esc(p.specs||'Consulte ficha técnica do modelo')}</td></tr></table><div style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn" data-quote="${esc(p.name)}">Adicionar ao orçamento</button><a class="btn btn-dark" href="${wa}" target="_blank" rel="noopener">Perguntar no WhatsApp</a></div><p class="form-note" style="margin-top:15px">Os dados técnicos e a disponibilidade devem ser confirmados para a versão escolhida.</p></div>`;
    const dup=target.previousElementSibling;if(dup&&dup.classList.contains('breadcrumbs'))dup.remove();   // evita migalhas duplicadas
    bindQuoteButtons(target);
    const main=$('[data-main]',target);
    $$('[data-thumb]',target).forEach(b=>b.addEventListener('click',()=>{if(!main)return;main.dataset.fb='';main.style.opacity='0';setTimeout(()=>{main.src=b.dataset.thumb;main.style.opacity=''},160);$$('[data-thumb]',target).forEach(x=>x.classList.toggle('on',x===b))}))}}

/* ---------- Fotos reais do site oficial (com fallback para as ilustrações locais) ---------- */
function useReal(img,url){
  if(!img||!url||img.dataset.real)return;img.dataset.real='1';
  const t=new Image();t.referrerPolicy='no-referrer';
  t.onload=()=>{img.referrerPolicy='no-referrer';img.src=url;img.classList.add('real-img');img.closest('.visual')?.classList.add('has-real')};
  t.src=url;   // se falhar, nada muda: a ilustração local continua
}
(function applyRealImages(){
  const R=window.HGE_REAL_IMAGES;if(!R)return;
  const byName=Object.fromEntries((window.HGE_PRODUCTS||[]).map(p=>[p.name,p.id]));
  $$('.product-card').forEach(c=>{const id=byName[c.dataset.name];useReal($('img',c),R.products[id]?.[0])});
  const slug=h=>(h||'').split('?')[0].split('/').pop().replace('.html','');
  $$('a.solution-card').forEach(a=>useReal($('.visual img',a),R.category[slug(a.getAttribute('href'))]));
  const page=slug(location.pathname);
  if(R.category[page]&&/\/pages\//.test(location.pathname))$$('.split img').forEach(i=>useReal(i,R.category[page]));
})();

decorate();

/* ================= EFEITOS VISUAIS ================= */
// barra de progresso + cabeçalho
const bar=document.createElement('div');bar.className='scroll-progress';document.body.prepend(bar);
const header=$('.site-header');
let tick=false;const onScroll=()=>{tick=false;const h=document.documentElement.scrollHeight-innerHeight;bar.style.setProperty('--p',h>0?Math.min(1,scrollY/h):0);header&&header.classList.toggle('scrolled',scrollY>20)};
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();

// faixa de categorias (marquee) logo após o hero da home
const hero=$('.hero');
if(hero){
  const words=['Iluminação pública','Iluminação comercial','Iluminação industrial','Refletores LED','Energia solar','LEDs para o Natal','Desde 2002'];
  const row=words.map(w=>`<span>${w}</span>`).join('');
  hero.insertAdjacentHTML('afterend',`<div class="marquee" aria-hidden="true"><div class="marquee-track">${row}${row}${row}${row}</div></div>`);
  // brilho nos postes da ilustração do hero
  const art=$('.hero-art');
  if(art)[[22.5,25.7],[43.3,37.1],[71.7,25.7],[93.3,40]].forEach(([x,y])=>{const g=document.createElement('i');g.className='lamp-glow';g.style.left=x+'%';g.style.top=y+'%';art.append(g)});
  // partículas de luz
  if(!reduce){
    const cv=document.createElement('canvas');cv.className='fx-canvas';cv.setAttribute('aria-hidden','true');hero.prepend(cv);
    const c=cv.getContext('2d');let W,H,parts=[],run=true;
    const size=()=>{const d=Math.min(devicePixelRatio||1,2);W=hero.clientWidth;H=hero.clientHeight;cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0);
      parts=Array.from({length:W<720?26:56},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2+.6,v:Math.random()*.45+.15,a:Math.random()*6.3,s:Math.random()*.02+.01}))};
    size();addEventListener('resize',size);
    new IntersectionObserver(es=>{run=es[0].isIntersecting;if(run)frame()}).observe(hero);
    function frame(){if(!run)return;c.clearRect(0,0,W,H);
      for(const p of parts){p.y-=p.v;p.x+=Math.sin(p.a)*.25;p.a+=p.s;if(p.y<-8){p.y=H+8;p.x=Math.random()*W}
        const al=.18+.5*Math.abs(Math.sin(p.a*1.6));c.fillStyle=`rgba(255,${170+(p.r*20|0)},70,${al})`;c.shadowColor='rgba(255,159,47,.8)';c.shadowBlur=10;c.beginPath();c.arc(p.x,p.y,p.r,0,6.3);c.fill()}
      requestAnimationFrame(frame)}
    frame();
  }
}

// revelar ao rolar (com escalonamento)
if(!reduce&&'IntersectionObserver'in window){
  const sel='.section-head,.solution-card,.product-card,.info-card,.stat,.trust-item,.split>*,.contact-item,.cta-band,.check-list li,.quote-panel,.legal-content>*,.notice,.catalog-tools,.footer-grid>div,.specs';
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);countUp(e.target)}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  $$(sel).forEach(el=>{if(el.closest('.hero,.page-hero'))return;el.classList.add('reveal');const sibs=[...el.parentElement.children].filter(x=>x.matches(sel));el.style.setProperty('--d',Math.min(sibs.indexOf(el),6)*90+'ms');io.observe(el)});
}
// contadores nos números (.stat strong)
function countUp(root){$$('.stat strong',root.matches?.('.stat')?root.parentElement:root).forEach(el=>{if(el.dataset.done)return;
  const m=el.textContent.trim().match(/^(\D*)(\d{1,3}(?:\.\d{3})+|\d+)(.*)$/);if(!m||reduce)return;el.dataset.done='1';
  const thousand=/\./.test(m[2]),end=parseInt(m[2].replace(/\./g,''),10),t0=performance.now(),dur=1600;
  (function f(t){const k=Math.min((t-t0)/dur,1),v=Math.round(end*(1-Math.pow(1-k,3)));el.textContent=m[1]+(thousand?v.toLocaleString('pt-BR'):v)+m[3];if(k<1)requestAnimationFrame(f)})(t0)})}

// inclinação 3D + brilho que segue o cursor
if(finePointer&&!reduce){
  $$('.solution-card,.product-card,.info-card,.stat').forEach(el=>{
    el.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      el.style.setProperty('--mx',x+'px');el.style.setProperty('--my',y+'px');
      if(!el.classList.contains('stat')){el.style.setProperty('--rx',((.5-y/r.height)*7).toFixed(2)+'deg');el.style.setProperty('--ry',((x/r.width-.5)*7).toFixed(2)+'deg')}});
    el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')})});
  // holofote que segue o mouse
  const g=document.createElement('div');g.className='cursor-glow';g.setAttribute('aria-hidden','true');document.body.append(g);
  let gx=0,gy=0,tx=0,ty=0,raf;const loop=()=>{gx+=(tx-gx)*.14;gy+=(ty-gy)*.14;g.style.transform=`translate(${gx}px,${gy}px)`;raf=requestAnimationFrame(loop)};
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!g.classList.contains('on')){g.classList.add('on');gx=tx;gy=ty;loop()}},{passive:true});
  document.addEventListener('pointerleave',()=>{g.classList.remove('on');cancelAnimationFrame(raf)});
}

// ondas nos botões (ripple)
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.btn,.nav-cta');if(!b||reduce)return;const r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)/4,i=document.createElement('span');i.className='ripple';i.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;b.append(i);setTimeout(()=>i.remove(),700)});

// transição suave entre páginas
if(!reduce){
  document.addEventListener('click',e=>{const a=e.target.closest('a[href]');
    if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download'))return;
    let u;try{u=new URL(a.href,location.href)}catch{return}
    if(u.protocol!==location.protocol||u.host!==location.host||!/^(https?|file):$/.test(u.protocol))return;
    if(u.pathname===location.pathname&&(u.hash||u.search===location.search))return;
    e.preventDefault();document.body.classList.add('leaving');setTimeout(()=>{location.href=a.href},200)});
  addEventListener('pageshow',e=>{if(e.persisted)document.body.classList.remove('leaving')});
}

// ano no rodapé (mantém compatibilidade com data-year)
$$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
})();
