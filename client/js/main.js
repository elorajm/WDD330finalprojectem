/* ============================================================
   main.js  —  Shared Client-Side Utilities
   Fitness Goal Tracker
   ============================================================ */

'use strict';

// ── API Configuration ────────────────────────────────────────
// Change this when you deploy your backend to Render
const API_BASE = 'http://localhost:5000/api';

/* ── Theme ──────────────────────────────────────────────────────
   Persisted in localStorage under 'fgt_theme'.
   Sets data-theme="dark" | "light" on <html>.
   Call Theme.apply() as early as possible to avoid a flash.
──────────────────────────────────────────────────────────────── */
const Theme = {
  get()      { return localStorage.getItem('fgt_theme') || 'light'; },
  set(t)     { localStorage.setItem('fgt_theme', t); this.apply(); },
  apply()    { document.documentElement.setAttribute('data-theme', this.get()); },
  toggle()   { this.set(this.get() === 'dark' ? 'light' : 'dark'); },
};

/* ── Draft Persistence ──────────────────────────────────────────
   Saves / restores form field values between page loads.
   Keys are prefixed with 'fgt_draft_'.
──────────────────────────────────────────────────────────────── */
const Draft = {
  save(key, data) {
    try { localStorage.setItem('fgt_draft_' + key, JSON.stringify(data)); } catch (_) {}
  },
  load(key) {
    try { return JSON.parse(localStorage.getItem('fgt_draft_' + key)); } catch (_) { return null; }
  },
  clear(key) { localStorage.removeItem('fgt_draft_' + key); },
};

/* ── Auth Token Helpers ─────────────────────────────────────────
   Simple wrappers around localStorage for the JWT token.
──────────────────────────────────────────────────────────────── */
const Auth = {
  setToken(token)  { localStorage.setItem('fgt_token', token); },
  getToken()       { return localStorage.getItem('fgt_token'); },
  clearToken()     { localStorage.removeItem('fgt_token'); },
  isLoggedIn()     { return !!this.getToken(); },
  getHeaders() {
    return {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${this.getToken()}`,
    };
  },
};

/* ── Page Guard ─────────────────────────────────────────────────
   Call on every protected page (not index.html).
   Redirects to index.html if no token is present.
──────────────────────────────────────────────────────────────── */
function requireAuth() {
  if (!Auth.isLoggedIn()) window.location.replace('index.html');
}

/* ── Button Loading State ───────────────────────────────────────
   Adds the CSS .btn-loading spinner class and disables the
   button. Restores original text when loading ends.
   Usage:
     btnLoading(btn, true);   // start
     btnLoading(btn, false);  // stop (restores original text)
──────────────────────────────────────────────────────────────── */
function btnLoading(btn, isLoading) {
  if (isLoading) {
    btn._origText = btn.textContent;
    btn.disabled  = true;
    btn.classList.add('btn-loading');
  } else {
    btn.disabled  = false;
    if (btn._origText !== undefined) btn.textContent = btn._origText;
    btn.classList.remove('btn-loading');
  }
}

/* ── Field-level Validation ─────────────────────────────────────
   Requires a <span class="field-error-msg"> somewhere inside
   the same .form-group element as the field.
──────────────────────────────────────────────────────────────── */
function setFieldError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.add('is-error');
  const group = field.closest('.form-group') || field.parentElement;
  const errEl = group && group.querySelector('.field-error-msg');
  if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.remove('is-error');
  const group = field.closest('.form-group') || field.parentElement;
  const errEl = group && group.querySelector('.field-error-msg');
  if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
}

function clearAllFieldErrors(formEl) {
  const root = formEl || document;
  root.querySelectorAll('.form-control.is-error').forEach(f => f.classList.remove('is-error'));
  root.querySelectorAll('.field-error-msg').forEach(e => { e.textContent = ''; e.style.display = 'none'; });
}

/* ── Active Nav Link ────────────────────────────────────────────
   Highlights the link whose href matches the current page.
──────────────────────────────────────────────────────────────── */
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === page) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ── Mobile Navigation ──────────────────────────────────────────
   Injects a ☰ hamburger button that toggles .navbar-nav.open
   at ≤768 px.  Closes automatically when a link is clicked.
──────────────────────────────────────────────────────────────── */
function initMobileNav() {
  const navActions = document.querySelector('.nav-actions');
  const navList    = document.querySelector('.navbar-nav');
  if (!navActions || !navList) return;

  const btn = document.createElement('button');
  btn.className = 'nav-hamburger';
  btn.setAttribute('aria-label', 'Toggle navigation menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = '☰';

  btn.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.textContent = isOpen ? '✕' : '☰';
  });

  navList.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '☰';
    });
  });

  navActions.prepend(btn);
}

/* ── Dark-mode Toggle Button ────────────────────────────────────
   Injects a 🌙 / ☀️ button into .nav-actions.
──────────────────────────────────────────────────────────────── */
function initThemeToggle() {
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;

  const btn = document.createElement('button');
  btn.className = 'btn-theme-toggle';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.textContent = Theme.get() === 'dark' ? '☀️' : '🌙';

  btn.addEventListener('click', () => {
    Theme.toggle();
    btn.textContent = Theme.get() === 'dark' ? '☀️' : '🌙';
  });

  // Insert before the first child so hamburger (prepended later) ends up first
  navActions.insertBefore(btn, navActions.firstChild);
}

/* ── Health Check ───────────────────────────────────────────────
   Pings /api/health to verify the server is reachable.
──────────────────────────────────────────────────────────────── */
async function checkServerHealth() {
  try {
    const res  = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    console.log('[API] Health check:', data.message);
    return data.success;
  } catch (err) {
    console.warn('[API] Server unreachable:', err.message);
    return false;
  }
}

/* ── Toast Notification ─────────────────────────────────────────
   Slide-in from the right, auto-dismisses after 3 s.
   Uses the toast-in / toast-out keyframes from styles.css.
──────────────────────────────────────────────────────────────── */
function showToast(message, type = 'success') {
  const existing = document.getElementById('app-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'app-toast';
  toast.textContent = message;

  const colors = {
    success: { bg: '#dcfce7', border: '#86efac', color: '#15803d' },
    error:   { bg: '#fef2f2', border: '#fca5a5', color: '#dc2626' },
    info:    { bg: '#dbeafe', border: '#93c5fd', color: '#1d4ed8' },
  };

  const c = colors[type] || colors.info;

  Object.assign(toast.style, {
    position:     'fixed',
    top:          '80px',
    right:        '20px',
    padding:      '0.75rem 1.25rem',
    background:   c.bg,
    border:       `1.5px solid ${c.border}`,
    color:        c.color,
    borderRadius: '0.625rem',
    fontSize:     '0.875rem',
    fontWeight:   '500',
    boxShadow:    '0 4px 12px rgba(0,0,0,.12)',
    zIndex:       '9999',
    fontFamily:   'inherit',
    maxWidth:     '320px',
    animation:    'toast-in 0.25s ease forwards',
  });

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toast-out 0.25s ease forwards';
    setTimeout(() => toast.remove(), 260);
  }, 3000);
}

/* ── Init ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Theme.apply();
  setActiveNavLink();
  initThemeToggle();
  initMobileNav();
});
