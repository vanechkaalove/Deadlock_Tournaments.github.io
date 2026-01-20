
(()=>{

const CHAT_KEY='deadlock_chat_messages';

/*
  РОЛЬ:
  - по умолчанию ВСЕ = игрок
  - ТОЛЬКО если админ вошёл через админ-панель
    (localStorage.admin === 'true') -> админ
*/
const isAdmin = localStorage.getItem('admin') === 'true';

let messages = JSON.parse(localStorage.getItem(CHAT_KEY)) || [];
let unread = 0;

const w = document.createElement('div');
w.className = 'chat-widget';
w.innerHTML = `
<div class="chat-header">
  ${isAdmin ? 'Админ чат' : 'Чат с админом'}
  <span class="chat-badge">0</span>
</div>
<div class="chat-body">
  <div class="chat-messages"></div>
  <div class="chat-input">
    <input type="text" placeholder="Введите сообщение..." />
    <button>▶</button>
  </div>
</div>
`;
document.body.appendChild(w);

const h = w.querySelector('.chat-header');
const badge = w.querySelector('.chat-badge');
const b = w.querySelector('.chat-body');
const m = w.querySelector('.chat-messages');
const i = w.querySelector('input');
const btn = w.querySelector('button');

h.onclick = () => {
  const open = b.style.display === 'flex';
  b.style.display = open ? 'none' : 'flex';
  if (!open) {
    unread = 0;
    badge.style.display = 'none';
    setTimeout(() => i.focus(), 50);
  }
};

function render(){
  m.innerHTML='';
  messages.forEach(msg=>{
    const d=document.createElement('div');
    d.className='chat-msg ' + (msg.role === 'admin' ? 'chat-admin' : 'chat-player');
    d.innerHTML = `
      <div class="chat-author">${msg.role === 'admin' ? 'Админ' : 'Игрок'}</div>
      <div>${msg.text}</div>
    `;
    m.appendChild(d);
  });
  m.scrollTop = m.scrollHeight;
}

function send(){
  const text = i.value.trim();
  if(!text) return;

  messages.push({
    text,
    role: isAdmin ? 'admin' : 'player',
    time: Date.now()
  });

  localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
  i.value='';
  render();
}

btn.onclick = send;
i.addEventListener('keydown', e => e.key === 'Enter' && send());
i.disabled = false;

window.addEventListener('storage', e => {
  if(e.key === CHAT_KEY){
    messages = JSON.parse(e.newValue) || [];
    if(b.style.display !== 'flex'){
      unread++;
      badge.textContent = unread;
      badge.style.display = 'inline-block';
    }
    render();
  }
});

render();
})();
