/* ============================================================
   auth.js  —  Firebase Authentication Logic
   Handles: login, signup, logout, auth-state page protection,
            user-friendly error messages, nav user display
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   SECTION 1 — ERROR MESSAGE HELPER
   Maps Firebase error codes to readable messages for users.
══════════════════════════════════════════════════════════════ */

/**
 * Convert a Firebase Auth error code into a friendly message.
 * @param {string} errorCode - e.g. "auth/wrong-password"
 * @returns {string} Human-readable error message
 */
function getAuthErrorMessage(errorCode) {
  const messages = {
    // Login errors
    'auth/user-not-found':      'No account found with this email address.',
    'auth/wrong-password':      'Incorrect password. Please try again.',
    'auth/invalid-credential':  'Invalid email or password. Please check and try again.',
    'auth/invalid-email':       'Please enter a valid email address.',
    'auth/user-disabled':       'This account has been disabled. Contact support.',
    'auth/too-many-requests':   'Too many failed attempts. Please wait a moment and try again.',

    // Signup errors
    'auth/email-already-in-use': 'An account with this email already exists. Try logging in.',
    'auth/weak-password':         'Password is too weak. Use at least 6 characters.',
    'auth/operation-not-allowed': 'Email/password sign-in is not enabled. Contact support.',

    // Network errors
    'auth/network-request-failed': 'Network error. Check your internet connection and try again.',
  };

  // Return mapped message or a safe generic fallback
  return messages[errorCode] || 'Something went wrong. Please try again.';
}

/* ══════════════════════════════════════════════════════════════
   SECTION 2 — UI HELPERS (error display, button loading state)
══════════════════════════════════════════════════════════════ */

/**
 * Show an error message below a form.
 * @param {string} elementId - The ID of the error container element
 * @param {string} message   - The message to display
 */
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = message;
  el.style.display = 'flex';
}

/**
 * Clear an error message container.
 * @param {string} elementId
 */
function clearError(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  el.style.display = 'none';
}

/**
 * Put a submit button into a loading/disabled state.
 * @param {HTMLButtonElement} btn
 * @param {boolean} isLoading
 * @param {string} originalText - The button's original label
 */
function setButtonLoading(btn, isLoading, originalText) {
  if (!btn) return;
  btn.disabled    = isLoading;
  btn.textContent = isLoading ? 'Please wait…' : originalText;
}

/* ══════════════════════════════════════════════════════════════
   SECTION 3 — PAGE PROTECTION (requireAuth)
   Call this on every protected page.
   If no user is signed in, they are redirected to index.html.
══════════════════════════════════════════════════════════════ */

/**
 * Guard a protected page.
 * - Hides the body until auth state is confirmed (prevents flash).
 * - Redirects to index.html if no user is logged in.
 * - If logged in, reveals the page and sets up the logout button.
 */
function requireAuth() {
  // Hide the page immediately to avoid showing content to guests
  document.body.style.visibility = 'hidden';

  auth.onAuthStateChanged(function(user) {
    if (!user) {
      // Not signed in — send to login page
      window.location.replace('index.html');
    } else {
      // Signed in — reveal the page
      document.body.style.visibility = 'visible';
      updateNavWithUser(user);
      initLogoutButton();
    }
  });
}

/* ══════════════════════════════════════════════════════════════
   SECTION 4 — LOGOUT
══════════════════════════════════════════════════════════════ */

/**
 * Wire the logout button on protected pages.
 * Looks for an element with id="logout-btn".
 */
function initLogoutButton() {
  const logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', function() {
    auth.signOut()
      .then(function() {
        // Redirect to login page after sign out
        window.location.href = 'index.html';
      })
      .catch(function(error) {
        console.error('[Logout] Error signing out:', error);
      });
  });
}

/* ══════════════════════════════════════════════════════════════
   SECTION 5 — NAV USER DISPLAY
   Shows the logged-in user's name/initial in the nav.
══════════════════════════════════════════════════════════════ */

/**
 * Update the nav avatar button to show the user's initial.
 * @param {firebase.User} user
 */
function updateNavWithUser(user) {
  const navAvatar   = document.querySelector('.nav-avatar');
  const navUserName = document.getElementById('nav-user-name');

  if (navAvatar && user.displayName) {
    // Show first initial of display name
    const initial = user.displayName.charAt(0).toUpperCase();
    navAvatar.textContent = initial;
    navAvatar.title       = user.displayName;
    navAvatar.setAttribute('aria-label', 'Profile: ' + user.displayName);
  }

  // If there's a user name placeholder in the nav
  if (navUserName && user.displayName) {
    navUserName.textContent = user.displayName.split(' ')[0]; // first name only
  }
}

/* ══════════════════════════════════════════════════════════════
   SECTION 6 — LOGIN FORM HANDLER
══════════════════════════════════════════════════════════════ */

function initLoginForm() {
  const form    = document.getElementById('login-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const btnLabel  = submitBtn ? submitBtn.textContent : 'Log In';

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearError('login-error');

    const email    = form.querySelector('#login-email').value.trim();
    const password = form.querySelector('#login-password').value;

    // Simple client-side validation before hitting Firebase
    if (!email || !password) {
      showError('login-error', 'Please enter your email and password.');
      return;
    }

    // Disable the button to prevent double-submit
    setButtonLoading(submitBtn, true, btnLabel);

    // ── Firebase: Sign in with email and password ──
    auth.signInWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        // Success — onAuthStateChanged will fire, but we redirect here too
        console.log('[Login] Signed in:', userCredential.user.email);
        window.location.href = 'dashboard.html';
      })
      .catch(function(error) {
        // Show a friendly error message
        const message = getAuthErrorMessage(error.code);
        showError('login-error', message);
        setButtonLoading(submitBtn, false, btnLabel);
        console.warn('[Login] Error:', error.code);
      });
  });

  // Clear error when user starts typing again
  form.querySelectorAll('input').forEach(function(input) {
    input.addEventListener('input', function() {
      clearError('login-error');
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   SECTION 7 — SIGN UP FORM HANDLER
══════════════════════════════════════════════════════════════ */

function initSignupForm() {
  const form    = document.getElementById('signup-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const btnLabel  = submitBtn ? submitBtn.textContent : 'Create Account';

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearError('signup-error');

    const name     = form.querySelector('#signup-name').value.trim();
    const email    = form.querySelector('#signup-email').value.trim();
    const password = form.querySelector('#signup-password').value;
    const confirm  = form.querySelector('#signup-confirm').value;

    // ── Client-side validation ──
    if (!name || !email || !password || !confirm) {
      showError('signup-error', 'Please fill in all required fields.');
      return;
    }

    if (password !== confirm) {
      showError('signup-error', 'Passwords do not match. Please try again.');
      return;
    }

    if (password.length < 6) {
      showError('signup-error', 'Password must be at least 6 characters long.');
      return;
    }

    setButtonLoading(submitBtn, true, btnLabel);

    // ── Firebase: Create a new user account ──
    auth.createUserWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        const user = userCredential.user;

        // Save the user's display name to their Firebase profile
        return user.updateProfile({ displayName: name })
          .then(function() {
            console.log('[Signup] Account created for:', email);
            // Redirect new users to set up their avatar first
            window.location.href = 'avatar.html';
          });
      })
      .catch(function(error) {
        const message = getAuthErrorMessage(error.code);
        showError('signup-error', message);
        setButtonLoading(submitBtn, false, btnLabel);
        console.warn('[Signup] Error:', error.code);
      });
  });

  // Clear error when user starts typing again
  form.querySelectorAll('input').forEach(function(input) {
    input.addEventListener('input', function() {
      clearError('signup-error');
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   SECTION 8 — PASSWORD RESET (Forgot Password)
══════════════════════════════════════════════════════════════ */

function initForgotPassword() {
  const forgotLink = document.getElementById('forgot-password-link');
  if (!forgotLink) return;

  forgotLink.addEventListener('click', function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('login-email');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email) {
      showError('login-error', 'Enter your email address above, then click "Forgot password?"');
      return;
    }

    // ── Firebase: Send password reset email ──
    auth.sendPasswordResetEmail(email)
      .then(function() {
        showError('login-error', '✅ Password reset email sent! Check your inbox.');
        const el = document.getElementById('login-error');
        if (el) el.style.color = 'var(--success)';
      })
      .catch(function(error) {
        showError('login-error', getAuthErrorMessage(error.code));
      });
  });
}

/* ══════════════════════════════════════════════════════════════
   SECTION 9 — INDEX PAGE INIT
   On the login/signup page: if user is already signed in,
   skip the login screen and go straight to the dashboard.
══════════════════════════════════════════════════════════════ */

function initAuthPage() {
  // If user is already signed in, redirect to dashboard
  auth.onAuthStateChanged(function(user) {
    if (user) {
      window.location.replace('dashboard.html');
    }
  });

  initLoginForm();
  initSignupForm();
  initForgotPassword();
}

/* ══════════════════════════════════════════════════════════════
   SECTION 10 — ROUTER
   Detects which page we're on and runs the right setup.
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') {
    // ── Login / Signup page ──
    initAuthPage();
  } else {
    // ── All other pages are protected ──
    requireAuth();
  }
});
