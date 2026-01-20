const ADMIN_LOGIN = 'admin'
const ADMIN_PASS = '1234'

let tournaments = JSON.parse(localStorage.getItem('tournaments')) || []
let participants = JSON.parse(localStorage.getItem('participants')) || []
let matches = JSON.parse(localStorage.getItem('matches')) || []
let logs = JSON.parse(localStorage.getItem('logs')) || []
let settings = JSON.parse(localStorage.getItem('settings')) || {
  siteTitle: 'Deadlock Tournaments',
  registration: true
}

const saveAll = () => {
  localStorage.setItem('tournaments', JSON.stringify(tournaments))
  localStorage.setItem('participants', JSON.stringify(participants))
  localStorage.setItem('matches', JSON.stringify(matches))
  localStorage.setItem('logs', JSON.stringify(logs))
  localStorage.setItem('settings', JSON.stringify(settings))
}

const logAction = (text) => {
  logs.push({ text, date: new Date().toLocaleString() })
  saveAll()
}

/* НАВИГАЦИЯ */
function showPage(id) {
  if (id === 'admin' && localStorage.getItem('admin') !== 'true') id = 'login'
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  document.getElementById(id).classList.add('active')
}

/* АВТОРИЗАЦИЯ */
function adminLogin() {
  if (
    document.getElementById('loginInput').value === ADMIN_LOGIN &&
    document.getElementById('passwordInput').value === ADMIN_PASS
  ) {
    localStorage.setItem('admin', 'true')
    showPage('admin')
    logAction('Вход администратора')
  } else {
    document.getElementById('error').innerText = 'Неверные данные'
  }
}

function logout() {
  localStorage.removeItem('admin')
  showPage('home')
}

/* ВКЛАДКИ */
function adminTab(id) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'))
  document.getElementById(id).classList.add('active')

  if (id === 'admin-stats') renderStats()
  if (id === 'admin-bracket') renderMatchParticipants()
  if (id === 'admin-logs') renderLogs()
}

/* ПАРОЛЬ */
function togglePassword() {
  const p = document.getElementById('passwordInput')
  p.type = p.type === 'password' ? 'text' : 'password'
}

/* ТУРНИРЫ */
function addTournament() {
  const name = document.getElementById('t-name').value
  if (!name) return alert('Введите название')
  tournaments.push({
    name,
    format: document.getElementById('t-format').value,
    prize: document.getElementById('t-prize').value,
    start: document.getElementById('t-start').value,
    end: document.getElementById('t-end').value
  })
  saveAll()
  renderTournaments()
}

function renderTournaments() {
  const admin = document.getElementById('t-admin-list')
  const pub = document.getElementById('tournament-public')
  admin.innerHTML = ''
  pub.innerHTML = ''
  tournaments.forEach((t, i) => {
    admin.innerHTML += `<div class="card">${t.name}
      <button onclick="tournaments.splice(${i},1);saveAll();renderTournaments()">Удалить</button>
    </div>`
    pub.innerHTML += `<div class="card">${t.name}</div>`
  })
}

/* УЧАСТНИКИ */
function addParticipant() {
  participants.push({
    nick: document.getElementById('p-nick').value,
    name: document.getElementById('p-name').value,
    age: document.getElementById('p-age').value,
    country: document.getElementById('p-country').value
  })
  saveAll()
  renderParticipants()
}

function renderParticipants() {
  const admin = document.getElementById('participants-admin-list')
  const pub = document.getElementById('participants-public')
  admin.innerHTML = ''
  pub.innerHTML = ''
  participants.forEach((p, i) => {
    admin.innerHTML += `<div class="card">${p.nick}
      <button onclick="participants.splice(${i},1);saveAll();renderParticipants()">Удалить</button>
    </div>`
    pub.innerHTML += `<div class="card">${p.nick}</div>`
  })
}

/* МАТЧИ */
function renderMatchParticipants() {
  const box = document.getElementById('match-participants')
  box.innerHTML = ''
  participants.forEach(p => {
    box.innerHTML += `<label><input type="checkbox" value="${p.nick}"> ${p.nick}</label><br>`
  })
}

function addMatch() {
  const players = [...document.querySelectorAll('#match-participants input:checked')].map(i => i.value)
  matches.push({
    team1: document.getElementById('b-team1').value,
    team2: document.getElementById('b-team2').value,
    score: document.getElementById('b-score').value,
    players
  })
  saveAll()
  renderMatches()
}

function renderMatches() {
  const admin = document.getElementById('bracket-admin-list')
  const pub = document.getElementById('bracket-public')
  admin.innerHTML = ''
  pub.innerHTML = ''
  matches.forEach(m => {
    admin.innerHTML += `<div class="card">${m.team1} vs ${m.team2}</div>`
    pub.innerHTML += `<div class="card">${m.team1} vs ${m.team2}</div>`
  })
}

/* СТАТИСТИКА */
function renderStats() {
  document.getElementById('stats-content').innerHTML = `
    <div class="card">Турниров: ${tournaments.length}</div>
    <div class="card">Участников: ${participants.length}</div>
    <div class="card">Матчей: ${matches.length}</div>`
}

/* ЛОГИ */
function renderLogs() {
  document.getElementById('logs-list').innerHTML =
    logs.map(l => `<div class="card">${l.date}: ${l.text}</div>`).join('')
}

/* НАСТРОЙКИ */
function saveSettings() {
  settings.siteTitle = document.getElementById('site-title-setting').value
  settings.registration = document.getElementById('registration-toggle').checked
  document.title = settings.siteTitle
  saveAll()
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  document.title = settings.siteTitle
  renderTournaments()
  renderParticipants()
  renderMatches()
})

/* ===== CHAT TAB ===== */
document.addEventListener('DOMContentLoaded',()=>{
 const menu=document.querySelector('.admin-menu');
 if(menu){
  const btn=document.createElement('button');
  btn.textContent='Чат';
  btn.onclick=()=>adminTab('admin-chat');
  menu.appendChild(btn);

  const tab=document.createElement('div');
  tab.id='admin-chat';
  tab.className='admin-tab';
  tab.innerHTML='<h2>Чат с игроками</h2><p>Используйте чат внизу страницы</p>';
  document.querySelector('#admin').appendChild(tab);
 }
});
