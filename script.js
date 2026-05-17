// ───────────────────────────────────────
// USERS STORAGE
// ───────────────────────────────────────
function getUsers() {
  return JSON.parse(localStorage.getItem('resume-users')) || [];
}

function saveUsers(users) {
  localStorage.setItem('resume-users', JSON.stringify(users));
}

// ───────────────────────────────────────
// DEFAULT ADMIN (username: admin / password: admin123)
// ───────────────────────────────────────
(function createDefaultAdmin() {
  let users = getUsers();
  const adminExists = users.find(u => u.username === 'admin');
  if (!adminExists) {
    users.push({ username: 'admin', password: 'admin123', role: 'admin' });
    saveUsers(users);
  }
})();

// ───────────────────────────────────────
// AUTHENTICATION STATE & TABS
// ───────────────────────────────────────
let currentAuthMode = 'login';

function switchAuthMode(mode) {
  currentAuthMode = mode;
  document.getElementById('tab-login').classList.toggle('active', mode === 'login');
  document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');
  
  document.getElementById('auth-action-btn').textContent = mode === 'login' ? 'Login' : 'Create Account';
  document.getElementById('auth-subtitle').textContent = mode === 'login' ? 'Enter your credentials' : 'Create a new user account';
  document.getElementById('login-error').textContent = '';
}

function showLogin() {
  switchAuthMode('login'); 
  document.getElementById('login-overlay').style.display = 'flex';
}

function handleAuthAction() {
  if (currentAuthMode === 'login') {
    loginUser();
  } else {
    signupUser();
  }
}

// ───────────────────────────────────────
// SIGNUP & LOGIN
// ───────────────────────────────────────
function signupUser() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errorDiv = document.getElementById('login-error');

  if (!username || !password) {
    errorDiv.style.color = '#f87171';
    errorDiv.textContent = 'Please fill out all fields.';
    return;
  }

  const users = getUsers();
  if (users.find(u => u.username === username)) {
    errorDiv.style.color = '#f87171';
    errorDiv.textContent = 'Username already exists.';
    return;
  }

  const newUser = { username: username, password: password, role: 'user' };
  users.push(newUser);
  saveUsers(users);
  
  errorDiv.style.color = '#34d399'; 
  errorDiv.textContent = 'Account created successfully! Logging you in...';
  
  setTimeout(() => { loginUser(username, password); }, 1000);
}

function loginUser(autoUser = null, autoPass = null) {
  const username = autoUser || document.getElementById('login-username').value.trim();
  const password = autoPass || document.getElementById('login-password').value.trim();
  const errorDiv = document.getElementById('login-error');

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    errorDiv.style.color = '#f87171';
    errorDiv.textContent = 'Invalid username or password';
    return;
  }

  sessionStorage.setItem('logged-user', JSON.stringify(user));
  document.getElementById('login-overlay').style.display = 'none';
  
  applyUserUI(user);
  
  if (user.role === 'user') {
    loadUserInstance(user.username);
  }
  
  showToast(`✓ Welcome back, ${username}`);
}

function logout() {
  sessionStorage.removeItem('logged-user');
  location.reload();
}

function getLoggedUser() {
  return JSON.parse(sessionStorage.getItem('logged-user'));
}

function applyUserUI(user) {
  const isAuth = !!user;
  document.getElementById('config-btn-wrap').style.display = isAuth ? 'flex' : 'none';
  document.getElementById('save-btn').style.display = isAuth ? 'inline-flex' : 'none';
  document.getElementById('admin-badge').style.display = isAuth ? 'inline-flex' : 'none';
  document.getElementById('admin-login-btn').style.display = isAuth ? 'none' : 'inline-flex';

  const panel = document.getElementById('config-panel');
  if (isAuth) {
    panel.classList.remove('hidden');
  } else {
    panel.classList.add('hidden');
  }
}

// ───────────────────────────────────────
// INITIALIZE APP (GUEST MODE INCLUDED)
// ───────────────────────────────────────
(function initAuth() {
  const user = getLoggedUser();
  
  if (user) {
    applyUserUI(user);
    if (user.role === 'user') loadUserInstance(user.username);
  } else {
    // Guest Mode 
    document.getElementById('config-btn-wrap').style.display = 'flex';
    document.getElementById('save-btn').style.display = 'inline-flex'; 
    document.getElementById('admin-login-btn').style.display = 'inline-flex';
    document.getElementById('admin-badge').style.display = 'none';
    
    document.getElementById('config-panel').classList.add('hidden');
    
    document.getElementById('cfg-name').value = "Guest User";
    document.getElementById('cfg-title').value = "Configure your title here";
    
    liveUpdate();
  }
})();

// ───────────────────────────────────────
// TAB & UI HELPERS
// ───────────────────────────────────────
function switchTab(tabId, btn) {
  document.querySelectorAll('.cp-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('[id^="tab-"]').forEach(t => t.style.display = 'none');
  if(!btn.id.includes('login') && !btn.id.includes('signup')){
      btn.classList.add('active');
      document.getElementById('tab-' + tabId).style.display = 'block';
  }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function togglePanel() {
  document.getElementById('config-panel').classList.toggle('hidden');
}

// ───────────────────────────────────────
// SAVE CONFIGURATION (GUEST INTERCEPT)
// ───────────────────────────────────────
function saveConfig() {
  const user = getLoggedUser();
  
  if (!user) {
    showToast('⚠️ Please Sign Up or Login to save your resume!');
    switchAuthMode('signup'); 
    document.getElementById('login-overlay').style.display = 'flex';
    return;
  }

  const configData = {
    basics: {
      name: document.getElementById('cfg-name').value,
      title: document.getElementById('cfg-title').value,
      avail: document.getElementById('cfg-avail').value,
      location: document.getElementById('cfg-location').value,
      phone: document.getElementById('cfg-phone').value,
      email: document.getElementById('cfg-email').value,
      linkedin: document.getElementById('cfg-linkedin').value,
      github: document.getElementById('cfg-github').value,
      portfolio: document.getElementById('cfg-portfolio').value,
      summary: document.getElementById('cfg-summary').value,
      
      s1v: document.getElementById('cfg-s1v').value,
      s1l: document.getElementById('cfg-s1l').value,
      s2v: document.getElementById('cfg-s2v').value,
      s2l: document.getElementById('cfg-s2l').value,
      s3v: document.getElementById('cfg-s3v').value,
      s3l: document.getElementById('cfg-s3l').value,
      s4v: document.getElementById('cfg-s4v').value,
      s4l: document.getElementById('cfg-s4l').value,
      
      edeg: document.getElementById('cfg-edeg').value,
      euni: document.getElementById('cfg-euni').value,
      estart: document.getElementById('cfg-estart').value,
      eend: document.getElementById('cfg-eend').value,
    }
  };

  localStorage.setItem(`resume_config_${user.username}`, JSON.stringify(configData));
  showToast('💾 Resume configuration saved!');
}

function createUserInstance(username) {
  const defaultInstanceConfig = { basics: { name: username, title: "", location: "" }, experience: [], skills: [] };
  localStorage.setItem(`resume_config_${username}`, JSON.stringify(defaultInstanceConfig));
}

// ───────────────────────────────────────
// CREATE NEW INSTANCE (With Clean Slate Flag)
// ───────────────────────────────────────
function createUserInstance(username) {
  const defaultInstanceConfig = { 
    isNewAccount: true, // This flag tells the system to wipe the hardcoded HTML
    basics: { 
      name: username, 
      title: "Your Professional Title", 
      location: "",
      avail: "Open to Work",
      summary: "Write your professional summary here..." 
    }, 
    experience: [], 
    skills: [] 
  };
  localStorage.setItem(`resume_config_${username}`, JSON.stringify(defaultInstanceConfig));
}

// ───────────────────────────────────────
// LOAD INSTANCE DATA ON LOGIN
// ───────────────────────────────────────
function loadUserInstance(username) {
  const savedData = localStorage.getItem(`resume_config_${username}`);
  
  if (savedData) {
    const config = JSON.parse(savedData);
    
    // IF THIS IS A BRAND NEW ACCOUNT, WIPE THE HARDCODED HTML
    if (config.isNewAccount) {
      // Clear Jobs
      document.querySelectorAll('.job-entry').forEach(el => el.remove());
      // Clear Progress Bars
      document.querySelectorAll('.prog-item').forEach(el => el.remove());
      // Clear Skill Tags
      document.querySelectorAll('.sg-tag').forEach(el => el.remove());
      // Clear ATS Keywords
      document.querySelectorAll('.kw').forEach(el => el.remove());
      // Clear Open To Items
      document.querySelectorAll('.open-item').forEach(el => el.remove());
      
      // Turn off the flag so it doesn't wipe their own data in the future
      config.isNewAccount = false;
      localStorage.setItem(`resume_config_${username}`, JSON.stringify(config));
    }

    // Populate the inputs with the saved data
    if (config.basics) {
      document.getElementById('cfg-name').value = config.basics.name || '';
      document.getElementById('cfg-title').value = config.basics.title || '';
      document.getElementById('cfg-avail').value = config.basics.avail || 'Open to Work';
      document.getElementById('cfg-location').value = config.basics.location || '';
      document.getElementById('cfg-phone').value = config.basics.phone || '';
      document.getElementById('cfg-email').value = config.basics.email || '';
      document.getElementById('cfg-linkedin').value = config.basics.linkedin || '';
      document.getElementById('cfg-github').value = config.basics.github || '';
      document.getElementById('cfg-portfolio').value = config.basics.portfolio || '';
      document.getElementById('cfg-summary').value = config.basics.summary || '';
      
      document.getElementById('cfg-s1v').value = config.basics.s1v || '';
      document.getElementById('cfg-s1l').value = config.basics.s1l || '';
      document.getElementById('cfg-s2v').value = config.basics.s2v || '';
      document.getElementById('cfg-s2l').value = config.basics.s2l || '';
      document.getElementById('cfg-s3v').value = config.basics.s3v || '';
      document.getElementById('cfg-s3l').value = config.basics.s3l || '';
      document.getElementById('cfg-s4v').value = config.basics.s4v || '';
      document.getElementById('cfg-s4l').value = config.basics.s4l || '';
      
      document.getElementById('cfg-edeg').value = config.basics.edeg || '';
      document.getElementById('cfg-euni').value = config.basics.euni || '';
      document.getElementById('cfg-estart').value = config.basics.estart || '';
      document.getElementById('cfg-eend').value = config.basics.eend || '';
    }
    
    // Update the live preview
    liveUpdate();
    
  } else {
    // Fallback if data is completely missing
    createUserInstance(username);
    loadUserInstance(username); // Load it immediately after creating
  }
}

// ───────────────────────────────────────
// LIVE UPDATE PREVIEW
// ───────────────────────────────────────
function liveUpdate() {
  const nameEl = document.querySelector('.rh-name');
  if (nameEl) nameEl.textContent = document.getElementById('cfg-name').value || 'Your Name';

  const roleEl = document.querySelector('.rh-role');
  if (roleEl) roleEl.textContent = document.getElementById('cfg-title').value || 'Your Title';

  const availEl = document.querySelector('.rh-avail');
  if (availEl) availEl.innerHTML = '<div class="pulse"></div>' + document.getElementById('cfg-avail').value;

  const summaryEl = document.querySelector('.summary-p');
  if (summaryEl) summaryEl.textContent = document.getElementById('cfg-summary').value;

  const contacts = document.querySelectorAll('.rh-contacts span');
  if (contacts.length >= 4) {
    contacts[0].textContent = '📍 ' + (document.getElementById('cfg-location').value || 'Location');
    contacts[1].textContent = '📞 ' + (document.getElementById('cfg-phone').value || 'Phone');
    contacts[2].textContent = '✉️ ' + (document.getElementById('cfg-email').value || 'Email');
    contacts[3].textContent = '🔗 ' + (document.getElementById('cfg-linkedin').value || 'LinkedIn');
  }

  const statNums = document.querySelectorAll('.stat-num');
  const statLbls = document.querySelectorAll('.stat-lbl');
  if (statNums.length >= 4 && statLbls.length >= 4) {
    statNums[0].textContent = document.getElementById('cfg-s1v').value || '-';
    statLbls[0].textContent = document.getElementById('cfg-s1l').value || '-';
    statNums[1].textContent = document.getElementById('cfg-s2v').value || '-';
    statLbls[1].textContent = document.getElementById('cfg-s2l').value || '-';
    statNums[2].textContent = document.getElementById('cfg-s3v').value || '-';
    statLbls[2].textContent = document.getElementById('cfg-s3l').value || '-';
    statNums[3].textContent = document.getElementById('cfg-s4v').value || '-';
    statLbls[3].textContent = document.getElementById('cfg-s4l').value || '-';
  }

  const eduDeg = document.querySelector('.edu-deg');
  const eduUni = document.querySelector('.edu-uni');
  const eduYr = document.querySelector('.edu-yr');
  
  if (eduDeg) eduDeg.textContent = document.getElementById('cfg-edeg').value || 'Degree';
  if (eduUni) eduUni.textContent = document.getElementById('cfg-euni').value || 'University';
  if (eduYr) {
    const start = document.getElementById('cfg-estart').value || 'YYYY';
    const end = document.getElementById('cfg-eend').value || 'YYYY';
    eduYr.textContent = `${start} - ${end}`;
  }

  const progWrap = document.querySelector('.prog-wrap');
  if (progWrap) progWrap.style.display = document.getElementById('tog-prog').checked ? 'block' : 'none';

  const statGrid = document.querySelector('.stat-grid');
  if (statGrid) statGrid.style.display = document.getElementById('tog-stats').checked ? 'grid' : 'none';

  const atsSec = document.querySelector('.kw-section');
  if (atsSec) atsSec.style.display = document.getElementById('tog-ats').checked ? 'block' : 'none';

  const openCard = document.querySelector('.open-card');
  if (openCard) openCard.style.display = document.getElementById('tog-opento').checked ? 'block' : 'none';
  
  const currentBadges = document.querySelectorAll('.je-current');
  currentBadges.forEach(badge => {
     badge.style.display = document.getElementById('tog-current').checked ? 'inline-flex' : 'none';
  });
}

// ───────────────────────────────────────
// THEME & COLOR CONTROLS
// ───────────────────────────────────────
function setAccent(element) {
  document.querySelectorAll('.color-opt').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');
  const hexColor = element.getAttribute('data-color');
  applyCustomColor(hexColor);
  document.getElementById('cfg-custom-color').value = hexColor;
}

function applyCustomColor(hex) {
  if (/^#[0-9A-F]{6}$/i.test(hex) || /^#[0-9A-F]{3}$/i.test(hex)) {
    document.documentElement.style.setProperty('--accent', hex);
    document.documentElement.style.setProperty('--accent2', hex + 'cc'); 
  }
}