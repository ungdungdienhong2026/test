/* VPT Portal — tiện ích dùng chung. Nạp SAU assets/vpt.css, TRƯỚC script của trang. */
(function(){
  // Theme: đọc sớm để không nháy màu; đồng bộ giữa portal và các iframe qua localStorage.
  try{var t=localStorage.getItem('vpt_theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}
  window.addEventListener('storage',function(e){if(e.key==='vpt_theme'){document.documentElement.dataset.theme=e.newValue||'';}});
})();
window.VPT=(function(){
  const $=s=>document.querySelector(s);
  const pad=n=>String(n).padStart(2,'0');
  const ds=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const parseDs=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
  const addDays=(d,n)=>{const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()+n);return x};
  const mondayOf=d=>{const w=d.getDay();return addDays(d,w===0?-6:1-w)};
  const isoWeek=d=>{const t=new Date(d.getFullYear(),d.getMonth(),d.getDate());t.setDate(t.getDate()+3-(t.getDay()+6)%7);const w1=new Date(t.getFullYear(),0,4);return 1+Math.round(((t-w1)/864e5-3+(w1.getDay()+6)%7)/7)};
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fm=m=>`${pad(Math.floor(m/60))}:${pad(m%60)}`;
  const nowMin=()=>{const n=new Date();return n.getHours()*60+n.getMinutes()};
  const todayStr=()=>ds(new Date());
  const DS=['CN','T2','T3','T4','T5','T6','T7'];
  const DL=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
  const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
  let toastT;
  function toast(tx,kind){let el=$('#toast');if(!el){el=document.createElement('div');el.id='toast';el.className='toast';el.innerHTML='<span class="ms fill">check_circle</span><span id="toast-tx"></span>';document.body.appendChild(el)}
    el.className='toast'+(kind?' '+kind:'');el.querySelector('.ms').textContent=kind==='bad'?'error':kind==='warn'?'warning':'check_circle';
    el.querySelector('#toast-tx').textContent=tx;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>el.hidden=true,kind==='bad'?4000:2400)}
  const money=n=>{n=Number(n)||0;return n>=1000?(Math.round(n/100)/10).toLocaleString('vi-VN')+'k':n+'đ'};
  const moneyFull=n=>(Number(n)||0).toLocaleString('vi-VN')+' đ';
  const mq=window.matchMedia('(prefers-color-scheme: dark)');
  const effTheme=()=>document.documentElement.dataset.theme||(mq.matches?'dark':'light');
  function setTheme(t){document.documentElement.dataset.theme=t;try{localStorage.setItem('vpt_theme',t)}catch(e){}}
  return {$,pad,ds,parseDs,addDays,mondayOf,isoWeek,esc,fm,nowMin,todayStr,DS,DL,store,toast,money,moneyFull,effTheme,setTheme,mq};
})();
