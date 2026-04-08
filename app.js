// SchoolScribe - Landing Page + App
const STORAGE_KEY = 'schoolscribe.v2';
const root = document.documentElement;

// Landing page elements
const landingPage = document.getElementById('landingPage');
const appPage = document.getElementById('appPage');
const launchBtn = document.getElementById('launchBtn');
const ctaBtn = document.getElementById('ctaBtn');
const ctaBtnBottom = document.getElementById('ctaBtnBottom');

// Navigation
launchBtn.addEventListener('click', goToApp);
ctaBtn.addEventListener('click', goToApp);
ctaBtnBottom.addEventListener('click', goToApp);
document.getElementById('backBtn').addEventListener('click', goToHome);

function goToApp() {
  landingPage.style.display = 'none';
  appPage.style.display = 'flex';
  init();
}

function goToHome() {
  appPage.style.display = 'none';
  landingPage.style.display = 'flex';
}

// APP STATE & LOGIC
let state = null;
let currentNoteId = null;
let activeNotebook = null;
let activeTag = null;
let gridMode = localStorage.getItem('ss_gridMode') !== 'false';
let sortBy = localStorage.getItem('ss_sortBy') || 'updated';

const refs = {
  notebookList: document.getElementById('notebookList'),
  notesList: document.getElementById('notesList'),
  newNoteBtn: document.getElementById('newNoteBtn'),
  addNotebook: document.getElementById('addNotebook'),
  noteTitle: document.getElementById('noteTitle'),
  noteBody: document.getElementById('noteBody'),
  noteTags: document.getElementById('noteTags'),
  noteNotebook: document.getElementById('noteNotebook'),
  saveNote: document.getElementById('saveNote'),
  deleteNote: document.getElementById('deleteNote'),
  closeEditor: document.getElementById('closeEditor'),
  editorPane: document.getElementById('editorPane'),
  search: document.getElementById('search'),
  preview: document.getElementById('preview'),
  themeToggle: document.getElementById('themeToggle'),
  tagCloud: document.getElementById('tagCloud'),
  notesTitle: document.getElementById('notesTitle'),
  noteCardTpl: document.getElementById('noteCardTpl'),
  sortSelect: document.getElementById('sortSelect'),
  gridToggle: document.getElementById('gridToggle'),
  helpBtn: document.getElementById('helpBtn'),
  exportBtn: document.getElementById('exportBtn'),
  wordCount: document.getElementById('wordCount'),
  helpModal: document.getElementById('helpModal'),
  closeHelp: document.getElementById('closeHelp'),
};

function init() {
  state = loadState();
  applyTheme(state.theme || 'light');
  refs.sortSelect.value = sortBy;
  updateGridToggleIcon();
  renderAll();
  attachEventListeners();
}

function attachEventListeners() {
  refs.newNoteBtn.addEventListener('click', newNote);
  refs.addNotebook.addEventListener('click', addNotebook);
  refs.saveNote.addEventListener('click', saveNote);
  refs.deleteNote.addEventListener('click', deleteNote);
  refs.closeEditor.addEventListener('click', closeEditor);
  refs.search.addEventListener('input', e => renderNotes(e.target.value));
  refs.noteBody.addEventListener('input', updatePreview);
  refs.noteTitle.addEventListener('input', autosaveDraft);
  refs.noteTags.addEventListener('input', autosaveDraft);
  refs.themeToggle.addEventListener('click', toggleTheme);
  refs.sortSelect.addEventListener('change', e => { sortBy = e.target.value; localStorage.setItem('ss_sortBy', sortBy); renderNotes(); });
  refs.gridToggle.addEventListener('click', toggleGridMode);
  refs.helpBtn.addEventListener('click', showHelp);
  refs.closeHelp.addEventListener('click', closeHelp);
  refs.exportBtn.addEventListener('click', exportNotes);
  refs.helpModal.addEventListener('click', e => { if(e.target === refs.helpModal) closeHelp(); });
  document.addEventListener('keydown', globalShortcuts);
}

// Data helpers
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    return JSON.parse(raw);
  } catch(e) { return defaultState(); }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function defaultState() {
  return {
    theme: localStorage.getItem('ss_theme') || 'light',
    notebooks: [{id:'inbox',name:'Inbox'}],
    notes: [
      {id:'n_welcome',title:'Welcome to SchoolScribe',body:'**Tip**: Press `N` to create a new note. Use Markdown for *formatting*.\n\n- Create notebooks\n- Add tags\n- Toggle dark mode\n- Press `?` for help',tags:'welcome,guide',notebook:'inbox',created:Date.now(),updated:Date.now()}
    ]
  };
}

// Rendering
function renderAll() {
  renderNotebooks();
  renderNotes();
  renderTagCloud();
  populateNotebookSelect();
}

function renderNotebooks() {
  refs.notebookList.innerHTML = '';
  state.notebooks.forEach(nb => {
    const li = document.createElement('li');
    li.textContent = nb.name;
    li.dataset.id = nb.id;
    li.className = nb.id === activeNotebook ? 'active' : '';
    li.addEventListener('click', () => {
      activeNotebook = nb.id === activeNotebook ? null : nb.id;
      refs.notesTitle.textContent = activeNotebook ? `Notebook: ${nb.name}` : 'All Notes';
      renderNotes();
    });
    refs.notebookList.appendChild(li);
  });
}

function renderNotes(query = '') {
  refs.notesList.innerHTML = '';
  const q = (query || refs.search.value || '').trim().toLowerCase();
  let notes = state.notes.slice();

  if(activeNotebook) notes = notes.filter(n => n.notebook === activeNotebook);
  if(activeTag) notes = notes.filter(n => (n.tags||'').split(',').map(t => t.trim()).includes(activeTag));
  if(q) notes = notes.filter(n => (n.title + ' ' + n.body + ' ' + (n.tags||'')).toLowerCase().includes(q));

  if(sortBy === 'created') {
    notes.sort((a,b) => b.created - a.created);
  } else {
    notes.sort((a,b) => b.updated - a.updated);
  }

  notes.forEach(n => {
    const tpl = refs.noteCardTpl.content.cloneNode(true);
    const card = tpl.querySelector('.note-card');
    tpl.querySelector('.note-title').textContent = n.title || 'Untitled';
    tpl.querySelector('.note-time').textContent = timeAgo(n.updated);
    tpl.querySelector('.note-body').textContent = (n.body || '').substring(0, 120).replace(/\n/g,' ');
    const tagsWrap = tpl.querySelector('.note-tags');
    (n.tags||'').split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
      const chip = document.createElement('span');
      chip.className = 'tag';
      chip.textContent = t;
      chip.addEventListener('click', e => { e.stopPropagation(); activeTag = t; renderNotes(); });
      tagsWrap.appendChild(chip);
    });
    card.addEventListener('click', () => openEditor(n.id));
    refs.notesList.appendChild(tpl);
  });

  refs.notesList.className = gridMode ? 'notes-list grid-view' : 'notes-list list-view';
}

function renderTagCloud() {
  const tags = {};
  state.notes.forEach(n => {
    (n.tags||'').split(',').map(t => t.trim()).filter(Boolean).forEach(t => {
      tags[t] = (tags[t]||0) + 1;
    });
  });
  refs.tagCloud.innerHTML = '';
  Object.keys(tags).sort().forEach(t => {
    const el = document.createElement('div');
    el.className = 'tag' + (t === activeTag ? ' active' : '');
    el.textContent = `${t} (${tags[t]})`;
    el.addEventListener('click', () => { activeTag = t === activeTag ? null : t; renderNotes(); });
    refs.tagCloud.appendChild(el);
  });
}

function populateNotebookSelect() {
  refs.noteNotebook.innerHTML = '';
  state.notebooks.forEach(nb => {
    const opt = document.createElement('option');
    opt.value = nb.id;
    opt.textContent = nb.name;
    refs.noteNotebook.appendChild(opt);
  });
}

// Editor
function openEditor(id) {
  currentNoteId = id;
  const note = state.notes.find(n => n.id === id);
  if(!note) return;
  refs.editorPane.style.display = 'flex';
  refs.noteTitle.value = note.title;
  refs.noteBody.value = note.body;
  refs.noteTags.value = note.tags || '';
  refs.noteNotebook.value = note.notebook || 'inbox';
  updatePreview();
  refs.noteTitle.focus();
}

function closeEditor() {
  currentNoteId = null;
  refs.editorPane.style.display = 'none';
}

function newNote() {
  const id = 'n_' + Date.now();
  const note = {id, title:'', body:'', tags:'', notebook: activeNotebook || 'inbox', created:Date.now(), updated:Date.now()};
  state.notes.push(note);
  saveState();
  renderAll();
  openEditor(id);
}

function saveNote() {
  if(!currentNoteId) return;
  const note = state.notes.find(n => n.id === currentNoteId);
  if(!note) return;
  note.title = refs.noteTitle.value;
  note.body = refs.noteBody.value;
  note.tags = refs.noteTags.value;
  note.notebook = refs.noteNotebook.value;
  note.updated = Date.now();
  saveState();
  renderAll();
  closeEditor();
}

function deleteNote() {
  if(!currentNoteId) return;
  if(!confirm('Delete this note?')) return;
  state.notes = state.notes.filter(n => n.id !== currentNoteId);
  saveState();
  renderAll();
  closeEditor();
}

function addNotebook() {
  const name = prompt('Notebook name');
  if(!name) return;
  const id = 'nb_' + Date.now();
  state.notebooks.push({id, name});
  saveState();
  renderAll();
}

// Preview and helpers
function updatePreview() {
  const md = refs.noteBody.value || '';
  refs.preview.innerHTML = simpleMarkdown(md);
  updateWordCount();
  autosaveDraft();
}

function updateWordCount() {
  const text = refs.noteBody.value || '';
  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const chars = text.length;
  refs.wordCount.textContent = `${words} words · ${chars} chars`;
}

function simpleMarkdown(md) {
  let out = md
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  
  out = out.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
  
  out = out.replace(/^### (.*$)/gim,'<h3>$1</h3>')
    .replace(/^## (.*$)/gim,'<h2>$1</h2>')
    .replace(/^# (.*$)/gim,'<h1>$1</h1>');
  
  out = out.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,'<em>$1</em>')
    .replace(/~~(.*?)~~/g,'<del>$1</del>');
  
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  out = out.replace(/^\s*[-*] (.*)/gm,'<li>$1</li>');
  out = out.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');
  
  out = out.replace(/^&gt; (.*$)/gm, '<blockquote>$1</blockquote>');
  out = out.replace(/(<blockquote>.*<\/blockquote>)/gms, s => s.replace(/<blockquote>/g,'<blockquote>').replace(/<\/blockquote>/g,'</blockquote>'));
  
  out = out.split(/\n{2,}/).map(p => {
    if(p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<pre') || p.startsWith('<blockquote>')) return p;
    return `<p>${p.replace(/\n/g,'<br>')}</p>`;
  }).join('');
  
  return out;
}

function autosaveDraft() {
  if(!currentNoteId) return;
  const note = state.notes.find(n => n.id === currentNoteId);
  if(!note) return;
  note.title = refs.noteTitle.value;
  note.body = refs.noteBody.value;
  note.tags = refs.noteTags.value;
  note.updated = Date.now();
  saveState();
}

// Utilities
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts)/1000);
  if(s < 60) return `${s}s ago`;
  if(s < 3600) return `${Math.floor(s/60)}m ago`;
  if(s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

// Theme
function applyTheme(t) {
  if(t === 'dark') {
    document.documentElement.classList.add('dark');
    refs.themeToggle.textContent = '☀️';
  } else {
    document.documentElement.classList.remove('dark');
    refs.themeToggle.textContent = '🌙';
  }
  state.theme = t;
  localStorage.setItem('ss_theme', t);
  saveState();
}

function toggleTheme() {
  applyTheme(state.theme === 'dark' ? 'light' : 'dark');
}

// Grid toggle
function toggleGridMode() {
  gridMode = !gridMode;
  localStorage.setItem('ss_gridMode', gridMode);
  updateGridToggleIcon();
  renderNotes();
}

function updateGridToggleIcon() {
  refs.gridToggle.textContent = gridMode ? '☰' : '▦';
  refs.gridToggle.title = gridMode ? 'List view' : 'Grid view';
}

// Help modal
function showHelp() {
  refs.helpModal.style.display = 'flex';
}

function closeHelp() {
  refs.helpModal.style.display = 'none';
}

// Export notes
function exportNotes() {
  const data = {
    exported: new Date().toISOString(),
    noteCount: state.notes.length,
    notebookCount: state.notebooks.length,
    notes: state.notes,
    notebooks: state.notebooks
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `schoolscribe-backup-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Shortcuts
function globalShortcuts(e) {
  if(e.key === '?') { e.preventDefault(); showHelp(); }
  if(e.key === 'n' && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    newNote();
  }
  if(e.key === 'Escape') { if(refs.helpModal.style.display === 'flex') closeHelp(); else closeEditor(); }
  if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveNote(); }
}
