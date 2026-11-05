const views = [...document.querySelectorAll('[data-view]')];
const labels = {"speech": "Спич", "sol": "Сол", "studio": "Студия", "calendar": "Календарь", "mail": "Почта", "projects": "Проекты", "team": "Моя команда", "org": "Оргструктура", "callcenter": "Колл-центр", "applications": "Анализ заявок", "toolkit": "AI Тулкит"};
const screen = document.getElementById('product-screen');
const panel = document.getElementById('screen-panel');
const dialog = document.getElementById('screen-dialog');
let current = 'speech';
function showView(key) {
 if (!labels[key]) return;
 current = key;
 for (const tab of views) { const active = tab.dataset.view === key; tab.setAttribute('aria-selected',String(active)); tab.tabIndex = active ? 0 : -1; }
 document.getElementById('studio-views').hidden = key !== 'studio';
 document.querySelectorAll('[data-studio-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.studioView==='studio')));
 const src = 'assets/screenshots/' + key + '.jpg';
 screen.src = src; screen.alt = labels[key] + ': настоящий интерфейс Плавно на демонстрационных данных';
 panel.setAttribute('aria-labelledby','tab-' + key);
 document.querySelector('.screen-open').setAttribute('aria-label','Увеличить экран: ' + labels[key]);
 document.getElementById('screen-large').src = src;
 document.getElementById('screen-large').alt = screen.alt;
 document.getElementById('screen-name').textContent = labels[key];
 document.getElementById('screen-download').href = src;
}
views.forEach((tab,index)=>{
 tab.addEventListener('click',()=>showView(tab.dataset.view));
 tab.addEventListener('keydown',event=>{
  let next;
  if(event.key==='ArrowRight')next=(index+1)%views.length;
  else if(event.key==='ArrowLeft')next=(index-1+views.length)%views.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=views.length-1;
  else return;
  event.preventDefault();showView(views[next].dataset.view);views[next].focus();
 });
});
document.querySelectorAll('[data-jump-view]').forEach(button=>button.addEventListener('click',()=>{
 showView(button.dataset.jumpView);
 document.getElementById('product').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 views.find(tab=>tab.dataset.view===current).focus({preventScroll:true});
}));
document.querySelector('.screen-open').addEventListener('click',()=>dialog.showModal());
document.getElementById('screen-close').addEventListener('click',()=>dialog.close());

document.querySelectorAll('[data-studio-view]').forEach(button=>button.addEventListener('click',()=>{
 const key=button.dataset.studioView;
 document.querySelectorAll('[data-studio-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const src='assets/screenshots/'+key+'.jpg';
 screen.src=src;screen.alt='Студия: '+button.textContent.toLowerCase()+' на демонстрационных данных';
 document.getElementById('screen-large').src=src;
 document.getElementById('screen-large').alt=screen.alt;
 document.getElementById('screen-name').textContent='Студия · '+button.textContent;
 document.getElementById('screen-download').href=src;
}));
