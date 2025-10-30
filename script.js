/* script.js - handles navigation toggle, form validation, feedback storage UI, and small helpers */

/* ---------- Nav toggle for mobile ---------- */
function initNavToggle(btnId, navId) {
  const btn = document.getElementById(btnId);
  const nav = document.querySelector(`#${navId}`);
  if (!btn || !nav) return;
  btn.addEventListener('click', () => nav.classList.toggle('show'));
}
document.addEventListener('DOMContentLoaded', () => {
  initNavToggle('nav-toggle','main-nav');
  initNavToggle('nav-toggle-2','main-nav-2');
  initNavToggle('nav-toggle-3','main-nav-3');

  // load any persisted feedback from localStorage (optional)
  if (window.localStorage) {
    const saved = localStorage.getItem('smartcampus_feedback_v1');
    if (saved) {
      try {
        window._feedbackStore = JSON.parse(saved);
      } catch(e) { window._feedbackStore = []; }
    }
  }
  renderFeedback();
});

/* ---------- Contact form (simple demo) ---------- */
function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const msg = document.getElementById('contact-message').value.trim();
  if (!name || !email || !msg) {
    alert('Please fill all fields.');
    return false;
  }
  // For demo just show confirmation
  alert('Thanks, ' + name + '! Your message has been recorded (demo).');
  e.target.reset();
  return false;
}

/* ---------- Feedback form logic ---------- */
window._feedbackStore = window._feedbackStore || [];

function handleFeedbackSubmit(e) {
  e.preventDefault();
  const student = document.getElementById('fb-student').value.trim();
  const lecture = document.getElementById('fb-lecture').value.trim();
  const instructor = document.getElementById('fb-instructor').value.trim();
  const rating = Number(document.getElementById('fb-rating').value);
  const comments = document.getElementById('fb-comments').value.trim();

  // Basic validation
  if (!student || !lecture || !instructor || !rating) {
    alert('Please fill required fields and provide a rating.');
    return false;
  }
  if (rating < 1 || rating > 5) {
    alert('Rating must be between 1 and 5.');
    return false;
  }

  const entry = {
    id: 'fb_' + Date.now(),
    student,
    lecture,
    instructor,
    rating,
    comments,
    createdAt: new Date().toISOString()
  };

  window._feedbackStore.unshift(entry);

  // persist to localStorage (optional)
  if (window.localStorage) {
    localStorage.setItem('smartcampus_feedback_v1', JSON.stringify(window._feedbackStore));
  }

  renderFeedback();
  e.target.reset();
  alert('Feedback submitted. Thank you!');
  return false;
}

function renderFeedback() {
  const container = document.getElementById('feedback-store');
  if (!container) return;
  container.innerHTML = '';
  if (!window._feedbackStore || window._feedbackStore.length === 0) {
    container.innerHTML = '<div class="muted">No feedback submitted yet.</div>';
    return;
  }
  window._feedbackStore.slice(0, 25).forEach(item => {
    const div = document.createElement('div');
    div.className = 'feedback-item';
    div.innerHTML = `<strong>${escapeHtml(item.lecture)}</strong>
      <div class="muted">Instructor: ${escapeHtml(item.instructor)} • Rating: ${item.rating} • ${new Date(item.createdAt).toLocaleString()}</div>
      <p>${escapeHtml(item.comments || '—')}</p>
      <div class="muted">By: ${escapeHtml(item.student)}</div>`;
    container.appendChild(div);
  });
}

function resetFeedback() {
  const form = document.getElementById('feedback-form');
  if (form) form.reset();
}

/* ---------- small util ---------- */
function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, function (m) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
  });
}

/* ---------- helper to open chat from buttons in pages ---------- */
function openChat() {
  if (window.SmartChat && typeof window.SmartChat.open === 'function') {
    window.SmartChat.open();
  } else {
    alert('Chat assistant is not ready yet.');
  }
}
function openChatWith(message) {
  if (window.SmartChat && typeof window.SmartChat.openWith === 'function') {
    window.SmartChat.openWith(message);
  } else {
    alert('Chat assistant is not ready yet.');
  }
}