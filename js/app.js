// =============================================
// GYAANSETU — Main Application JavaScript
// Handles: Firebase CRUD, Live Search, Category Filter, View Counter
// =============================================

// ---- Category helpers ----
const CATEGORIES = ['All', 'Coding', 'English', 'Maths', 'Digital Skills'];

// ---- Global Auth State ----
let currentUser = null;
let currentCredits = 0;

auth.onAuthStateChanged((user) => {
  const loginItem = document.getElementById('navLoginItem');
  const userItem = document.getElementById('navUserItem');
  const creditsEl = document.getElementById('navCredits');

  if (user) {
    currentUser = user;
    if (loginItem) loginItem.style.display = 'none';
    if (userItem) userItem.style.display = 'flex';

    // Fetch credits
    db.collection('users').doc(user.uid).onSnapshot(doc => {
      if (doc.exists) {
        currentCredits = doc.data().credits || 0;
        if (creditsEl) creditsEl.textContent = `★ ${currentCredits}`;
      }
    });
  } else {
    currentUser = null;
    currentCredits = 0;
    if (loginItem) loginItem.style.display = 'block';
    if (userItem) userItem.style.display = 'none';
  }
});

// Delay assigning logout event listener to ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('navLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.signOut().then(() => {
        window.location.href = window.location.pathname.includes('/pages/') ? '../index.html' : 'index.html';
      });
    });
  }
});

function showAlert(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.className = 'alert alert-error';
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

// ---- Auth Handlers (Login Page) ----
async function handleSignup(e) {
  e.preventDefault();
  const alertEl = document.getElementById('authAlert');
  const btn = document.getElementById('signupBtn');
  if (btn) btn.disabled = true;

  try {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const bio = document.getElementById('signupBio').value.trim();
    const strongSubject = document.getElementById('signupStrong').value;

    const cred = await auth.createUserWithEmailAndPassword(email, password);
    
    // Create User Profile in Firestore with 10 initial credits
    await db.collection('users').doc(cred.user.uid).set({
      name: name,
      email: email,
      bio: bio,
      strongSubject: strongSubject,
      credits: 10,
      rating: 5,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    window.location.href = '../index.html';
  } catch (err) {
    showAlert(alertEl, '❌ ' + err.message);
    if (btn) btn.disabled = false;
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const alertEl = document.getElementById('authAlert');
  const btn = document.getElementById('loginBtn');
  if (btn) btn.disabled = true;

  try {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = '../index.html';
  } catch (err) {
    showAlert(alertEl, '❌ Invalid email or password.');
    if (btn) btn.disabled = false;
  }
}


const CATEGORY_ICONS = {
  'Coding': '💻',
  'English': '📖',
  'Maths': '🔢',
  'Digital Skills': '📱'
};

const CATEGORY_THUMB = {
  'Coding': '💻',
  'English': '📖',
  'Maths': '🔢',
  'Digital Skills': '📱'
};

function getCategoryClass(cat) {
  const map = {
    'Coding': 'coding',
    'English': 'english',
    'Maths': 'maths',
    'Digital Skills': 'digital'
  };
  return map[cat] || 'coding';
}

function formatDate(timestamp) {
  if (!timestamp) return '';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function extractYouTubeId(url) {
  const regex = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function getYouTubeThumbnail(url) {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

function getYouTubeEmbedUrl(url) {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : null;
}

// ---- Tutorial Card Builder ----
function buildTutorialCard(tutorial) {
  const catClass = getCategoryClass(tutorial.category);
  const thumb = getYouTubeThumbnail(tutorial.youtubeLink);
  const icon = CATEGORY_THUMB[tutorial.category] || '🎓';
  const views = tutorial.views || 0;
  const date = formatDate(tutorial.createdAt);
  const initials = getInitials(tutorial.contributorName);
  const shortNotes = (tutorial.notes || '').slice(0, 120);

  const thumbHtml = thumb
    ? `<img src="${thumb}" alt="${tutorial.title}" loading="lazy" onerror="this.style.display='none'">`
    : '';

  return `
    <div class="tutorial-card" onclick="openTutorial('${tutorial.id}')">
      <div class="card-thumb">
        ${thumbHtml}
        <span class="card-thumb-placeholder">${icon}</span>
        <div class="card-play">▶</div>
        <span class="card-category-badge badge-${catClass}">${tutorial.category}</span>
        <div class="card-views">👁 ${views}</div>
      </div>
      <div class="card-body">
        <div class="card-title">${tutorial.title}</div>
        <div class="card-notes">${shortNotes}</div>
        <div class="card-footer">
          <div class="card-contributor">
            <div class="contributor-avatar">${initials}</div>
            <span>${tutorial.contributorName || 'Anonymous'}</span>
          </div>
          <span class="card-date">${date}</span>
        </div>
      </div>
    </div>
  `;
}

// ---- Navigate to Tutorial Detail ----
async function openTutorial(id) {
  if (!currentUser) {
    alert("Please log in or sign up first to watch tutorials!");
    return;
  }
  if (currentCredits <= 0) {
    alert("You have 0 credits! 🛑 You must teach a session or submit a new tutorial to earn more credits.");
    return;
  }
  
  // Deduct 1 credit
  await db.collection('users').doc(currentUser.uid).update({
    credits: firebase.firestore.FieldValue.increment(-1)
  });

  if (window.location.pathname.includes('/pages/')) {
    window.location.href = `detail.html?id=${id}`; // Already in pages folder
  } else {
    window.location.href = `pages/detail.html?id=${id}`; // From root folder
  }
}

// ---- Browse Page ----
let allTutorials = [];
let activeCategory = 'All';
let searchQuery = '';

function initBrowsePage() {
  const grid = document.getElementById('tutorialsGrid');
  const countEl = document.getElementById('tutorialsCount');
  const searchInput = document.getElementById('searchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Load from Firebase
  db.collection('tutorials')
    .orderBy('createdAt', 'desc')
    .onSnapshot(snapshot => {
      allTutorials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderTutorials();
    }, err => {
      console.error('Firebase error:', err);
      if (grid) grid.innerHTML = `<div class="no-results"><div class="icon">⚠️</div><h3>Could not load tutorials</h3><p>Please check your internet connection.</p></div>`;
    });

  // Live search
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value.toLowerCase();
      renderTutorials();
    });
  }

  // Category filter
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.cat;
      renderTutorials();
    });
  });
}

function renderTutorials() {
  const grid = document.getElementById('tutorialsGrid');
  const countEl = document.getElementById('tutorialsCount');
  if (!grid) return;

  let filtered = allTutorials;

  // Category filter
  if (activeCategory !== 'All') {
    filtered = filtered.filter(t => t.category === activeCategory);
  }

  // Live search
  if (searchQuery) {
    filtered = filtered.filter(t =>
      (t.title || '').toLowerCase().includes(searchQuery) ||
      (t.notes || '').toLowerCase().includes(searchQuery) ||
      (t.contributorName || '').toLowerCase().includes(searchQuery)
    );
  }

  // Count update
  if (countEl) {
    countEl.textContent = `${filtered.length} tutorial${filtered.length !== 1 ? 's' : ''} found`;
  }

  // Render
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results" style="grid-column:1/-1">
        <div class="icon">🔍</div>
        <h3>No tutorials found</h3>
        <p>Try a different search term or category filter.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(buildTutorialCard).join('');
}

// ---- Home Page — recent tutorials ----
function initHomePage() {
  const recentGrid = document.getElementById('recentGrid');
  const statsTotal = document.getElementById('statsTotal');
  if (!recentGrid && !statsTotal) return;

  db.collection('tutorials')
    .orderBy('createdAt', 'desc')
    .limit(6)
    .onSnapshot(snapshot => {
      const tutorials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (recentGrid) {
        recentGrid.innerHTML = tutorials.length
          ? tutorials.map(buildTutorialCard).join('')
          : `<div class="no-results" style="grid-column:1/-1"><div class="icon">📚</div><h3>No tutorials yet</h3><p>Be the first to <a href="pages/submit.html" style="color:var(--primary)">submit a tutorial</a>!</p></div>`;
      }
    });

  // Stats counter
  db.collection('tutorials').onSnapshot(snap => {
    if (statsTotal) statsTotal.textContent = snap.size;
  });
}

// ---- Submit Tutorial ----
function initSubmitPage() {
  const form = document.getElementById('submitForm');
  const successDiv = document.getElementById('formSuccess');
  const alertEl = document.getElementById('formAlert');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (alertEl) { alertEl.style.display = 'none'; }

    const title = form.title.value.trim();
    const youtubeLink = form.youtubeLink.value.trim();
    const category = form.category.value;
    const notes = form.notes.value.trim();
    const contributorName = form.contributorName.value.trim();

    // Validate YouTube URL
    if (!extractYouTubeId(youtubeLink)) {
      showAlert(alertEl, '❌ Please enter a valid YouTube URL (e.g. https://youtube.com/watch?v=...)');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Submitting...';

    try {
      await db.collection('tutorials').add({
        title,
        youtubeLink,
        category,
        notes,
        contributorName: contributorName || 'Anonymous',
        views: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Award 15 credits if logged in
      if (currentUser) {
        await db.collection('users').doc(currentUser.uid).update({
          credits: firebase.firestore.FieldValue.increment(15)
        });
      }

      form.style.display = 'none';
      if (successDiv) successDiv.style.display = 'block';
    } catch (err) {
      console.error('Submit error:', err);
      showAlert(alertEl, '❌ Failed to submit. Please check your connection and try again.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '🚀 Submit Tutorial';
    }
  });
}

// ---- Tutorial Detail Page ----
function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    window.location.href = '../pages/browse.html';
    return;
  }

  const loadingEl = document.getElementById('detailLoading');
  const contentEl = document.getElementById('detailContent');

  db.collection('tutorials').doc(id).get().then(doc => {
    if (!doc.exists) {
      if (loadingEl) loadingEl.innerHTML = '<div class="no-results"><div class="icon">😔</div><h3>Tutorial not found</h3></div>';
      return;
    }

    const t = { id: doc.id, ...doc.data() };

    // Increment view count
    db.collection('tutorials').doc(id).update({
      views: firebase.firestore.FieldValue.increment(1)
    }).catch(() => {});

    // Render detail
    const embedUrl = getYouTubeEmbedUrl(t.youtubeLink);
    const catClass = getCategoryClass(t.category);
    const date = formatDate(t.createdAt);

    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) {
      contentEl.style.display = 'block';
      contentEl.innerHTML = `
        <div class="detail-card">
          <div class="video-wrapper">
            ${embedUrl
              ? `<iframe src="${embedUrl}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" title="${t.title}"></iframe>`
              : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:white;font-size:1.1rem;">⚠️ Could not load video</div>`
            }
          </div>
          <div class="detail-body">
            <span class="detail-category badge-${catClass}">${t.category}</span>
            <h1 class="detail-title">${t.title}</h1>
            <div class="detail-meta">
              <div class="meta-item">👤 <strong>${t.contributorName || 'Anonymous'}</strong></div>
              <div class="meta-item">📅 ${date}</div>
              <div class="meta-item">👁 ${(t.views || 0) + 1} views</div>
              <div class="meta-item">🏷️ ${t.category}</div>
            </div>
            <div class="notes-section">
              <h3>📝 Notes & Summary</h3>
              <div class="notes-content">${t.notes || 'No notes provided for this tutorial.'}</div>
            </div>
          </div>
        </div>
      `;
    }
  }).catch(err => {
    console.error(err);
    if (loadingEl) loadingEl.innerHTML = '<div class="no-results"><div class="icon">⚠️</div><h3>Error loading tutorial</h3><p>Please try again.</p></div>';
  });
}

// ---- Navbar hamburger toggle ----
function initNavbar() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Highlight active link
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (path.includes(a.getAttribute('href'))) a.classList.add('active');
  });
}

// ---- Auto-animate stats counter on home ----
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = start;
  }, 16);
}

// ---- Mentor Page Logic ----
let allMentors = [];
let activeMentorCat = 'All';
let mentorSearchQuery = '';

function initMentorsPage() {
  const grid = document.getElementById('mentorsGrid');
  const countEl = document.getElementById('mentorsCount');
  const searchInput = document.getElementById('mentorSearchInput');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!grid) return;

  db.collection('users').onSnapshot(snapshot => {
    allMentors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderMentors();
  });

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      mentorSearchQuery = e.target.value.toLowerCase();
      renderMentors();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMentorCat = btn.dataset.cat;
      renderMentors();
    });
  });
}

function renderMentors() {
  const grid = document.getElementById('mentorsGrid');
  const countEl = document.getElementById('mentorsCount');
  if (!grid) return;

  let filtered = allMentors;
  if (activeMentorCat !== 'All') {
    filtered = filtered.filter(m => m.strongSubject === activeMentorCat);
  }
  if (mentorSearchQuery) {
    filtered = filtered.filter(m => 
      (m.name || '').toLowerCase().includes(mentorSearchQuery) ||
      (m.bio || '').toLowerCase().includes(mentorSearchQuery)
    );
  }

  if (countEl) countEl.textContent = `${filtered.length} mentor${filtered.length !== 1 ? 's' : ''} found`;

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results" style="grid-column:1/-1"><div class="icon">🔍</div><h3>No mentors found</h3></div>`;
    return;
  }

  grid.innerHTML = filtered.map(m => {
    const initials = getInitials(m.name);
    const catClass = getCategoryClass(m.strongSubject);
    return `
      <div class="tutorial-card" style="display:flex;flex-direction:column;min-height:220px;">
        <div class="card-body" style="flex:1;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
             <div class="contributor-avatar" style="width:48px;height:48px;font-size:1.2rem;">${initials}</div>
             <div>
               <div class="card-title" style="margin:0;">${m.name}</div>
               <div style="font-size:0.8rem;color:var(--text-light);">⭐ ${m.rating || 5.0} / 5.0 Rating</div>
             </div>
          </div>
          <span class="card-category-badge badge-${catClass}" style="position:static;display:inline-block;margin-bottom:12px;">${m.strongSubject || 'General'}</span>
          <div class="card-notes" style="font-style:italic;">"${m.bio || 'Happy to help anywhere I can!'}"</div>
        </div>
        <div style="padding:18px;border-top:1px solid var(--border);background:var(--off-white);">
          <button onclick="startClassroom('${m.id}')" class="submit-btn" style="padding:10px;font-size:0.9rem;">🤝 Start Session</button>
        </div>
      </div>
    `;
  }).join('');
}

function startClassroom(mentorId) {
  if (!currentUser) {
    alert("Please log in first to connect with mentors!");
    return;
  }
  const roomId = 'gyaansetu_' + Math.random().toString(36).substr(2, 9);
  window.location.href = `classroom.html?room=${roomId}&mentor=${mentorId}`;
}

// ---- Page Router — call correct init ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();

  const path = window.location.pathname;

  if (path.endsWith('index.html') || path === '/' || path.endsWith('/gyaansetu/')) {
    initHomePage();
  } else if (path.includes('browse')) {
    initBrowsePage();
  } else if (path.includes('submit')) {
    initSubmitPage();
  } else if (path.includes('detail')) {
    initDetailPage();
  } else if (path.includes('mentors')) {
    initMentorsPage();
  } else {
    // Try all (for pages/ subfolder)
    initHomePage();
    initBrowsePage();
    initSubmitPage();
    initDetailPage();
    initMentorsPage();
  }
});
