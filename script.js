const applyForm = document.getElementById('applyForm');
const applyButtons = document.querySelectorAll('.apply-now');
const applyResponse = document.getElementById('applyResponse');
const experienceCount = document.getElementById('experienceCount');
const whyCount = document.getElementById('whyCount');
const topStaff = document.getElementById('topStaff');
const teamCategories = document.getElementById('teamCategories');
const teamList = document.getElementById('teamList');
const teamError = document.getElementById('teamError');
const staffLoginBtn = document.getElementById('staffLoginBtn');
const staffPanelBtn = document.getElementById('staffPanelBtn');
const staffStatusText = document.getElementById('staffStatusText');
const staffLoginModal = document.getElementById('staffLoginModal');
const staffLoginForm = document.getElementById('staffLoginForm');
const staffModalClose = document.getElementById('staffModalClose');
const staffLoginMessage = document.getElementById('staffLoginMessage');
const passwordVisibilityToggle = document.getElementById('passwordVisibilityToggle');
const formerStaff = document.getElementById('formerStaff');
const staffDashboard = document.getElementById('staffDashboard');
const staffDashboardUser = document.getElementById('staffDashboardUser');
const staffDashboardRole = document.getElementById('staffDashboardRole');
const staffDashboardMessage = document.getElementById('staffDashboardMessage');
const staffGreetingText = document.getElementById('staffGreetingText');
const staffDateText = document.getElementById('staffDateText');
const staffTimeText = document.getElementById('staffTimeText');
const staffLoginPrompt = document.getElementById('staffLoginPrompt');
const warningForm = document.getElementById('warningForm');
const openBanBtn = document.getElementById('openBanBtn');
const openBanBtnSecondary = document.getElementById('openBanBtnSecondary');
const openWarningBtn = document.getElementById('openWarningBtn');
const openWarningBtnSecondary = document.getElementById('openWarningBtnSecondary');
const warningModal = document.getElementById('warningModal');
const banModal = document.getElementById('banModal');
const closeWarningModalBtn = document.getElementById('closeWarningModalBtn');
const closeBanModalBtn = document.getElementById('closeBanModalBtn');
const warningModalForm = document.getElementById('warningModalForm');
const banModalForm = document.getElementById('banModalForm');
const warningModalUsername = document.getElementById('warningModalUsername');
const warningModalReason = document.getElementById('warningModalReason');
const warningModalEvidence = document.getElementById('warningModalEvidence');
const banModalUsername = document.getElementById('banModalUsername');
const banModalReason = document.getElementById('banModalReason');
const banModalEvidence = document.getElementById('banModalEvidence');
const banModalDuration = document.getElementById('banModalDuration');
const recordSearchForm = document.getElementById('recordSearchForm');
const recordSearchUsername = document.getElementById('recordSearchUsername');
const recordSearchResult = document.getElementById('recordSearchResult');
const currentPassword = document.getElementById('currentPassword');
const newPassword = document.getElementById('newPassword');
const confirmNewPassword = document.getElementById('confirmNewPassword');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const createStaffAccountForm = document.getElementById('createStaffAccountForm');
const newStaffUsername = document.getElementById('newStaffUsername');
const newStaffPassword = document.getElementById('newStaffPassword');
const newStaffRole = document.getElementById('newStaffRole');
const ownerCreateAccount = document.getElementById('ownerCreateAccount');
const banForm = document.getElementById('banForm');
const warningsList = document.getElementById('warningsList');
const bansList = document.getElementById('bansList');
const staffSettingsForm = document.getElementById('staffSettingsForm');
const staffEmailInput = document.getElementById('staffEmail');
const staffBirthdayInput = document.getElementById('staffBirthday');
const leaveButton = document.getElementById('leaveButton');
const resignButton = document.getElementById('resignButton');
const staffSettingsMessage = document.getElementById('staffSettingsMessage');
const staffAccountStatus = document.getElementById('staffAccountStatus');
const birthdayBanner = document.getElementById('birthdayBanner');
const birthdayBannerText = document.getElementById('birthdayBannerText');
const staffManagementPanel = document.getElementById('staffManagementPanel');
const manageStaffUsername = document.getElementById('manageStaffUsername');
const manageStaffAction = document.getElementById('manageStaffAction');
const manageTeamRole = document.getElementById('manageTeamRole');
const managementNoteText = document.getElementById('managementNoteText');
const managementSuspendDuration = document.getElementById('managementSuspendDuration');
const manageStaffApply = document.getElementById('manageStaffApply');
const manageStaffClear = document.getElementById('manageStaffClear');
const manageStaffResult = document.getElementById('manageStaffResult');
const manageStaffRoleLabel = document.getElementById('manageStaffRoleLabel');
const manageStaffStatusLabel = document.getElementById('manageStaffStatusLabel');
const manageStaffTeamLabel = document.getElementById('manageStaffTeamLabel');
const playGameBtn = document.getElementById('playGameBtn');
const checkGameAccessBtn = document.getElementById('checkGameAccessBtn');
const gameJoinUsername = document.getElementById('gameJoinUsername');
const gameAccessMessage = document.getElementById('gameAccessMessage');

const staffSessionKey = 'waypointStaffSession';
const staffAccountsKey = 'waypointStaffAccounts';
const staffProfilesKey = 'waypointStaffProfiles';
const warningsKey = 'waypointWarnings';
const bansKey = 'waypointBans';

const staffAccounts = [
  { username: 'mcrnathan', password: 'ownerpass', displayName: 'mcrnathan', role: 'Owner', level: 4, email: '', birthday: '2000-03-15' },
  { username: 'Rocanti', password: 'managementpass', displayName: 'Rocanti', role: 'Management', level: 3, email: '', birthday: '2000-05-06' },
  { username: 'Chowlty', password: 'managementpass', displayName: 'Chowlty', role: 'Management', level: 3, email: '', birthday: '2000-07-28' },
  { username: 'MixBoss28', password: 'managementpass', displayName: 'MixBoss28', role: 'Management', level: 3, email: '', birthday: '2000-08-12' },
  { username: 'Seby17119', password: 'devpass', displayName: 'Seby17119', role: 'Developer', level: 2, email: '', birthday: '2000-11-02' },
  { username: 'ActualCheddar', password: 'devpass', displayName: 'ActualCheddar', role: 'Developer', level: 2, email: '', birthday: '2000-01-22' },
];

const roleColorMap = {
  Owner: '#5c60d6',
  'Senior Management': '#5c60d6',
  Management: '#7c3aed',
  Developer: '#dc2525',
};

// Roblox userIds resolved live by username for staff accounts that aren't
// part of the hardcoded staffMembers list above (e.g. accounts created later
// via the Create Staff Account panel). Keyed by lowercase username.
let robloxIdCache = {};

const DEFAULT_SUPPORT_EMAIL = 'mixci1000@gmail.com';
const DEFAULT_STAFF_SENDER_EMAIL = 'mixci10000@gmail.com';

const apiBase = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

async function apiRequest(path, options = {}) {
  const defaultHeaders = { 'Content-Type': 'application/json' };
  const url = `${apiBase}${path}`;

  try {
    const response = await fetch(url, {
      headers: defaultHeaders,
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : null;

    if (!response.ok) {
      const message = payload && payload.error ? payload.error : 'Request failed';
      throw new Error(message);
    }

    return payload;
  } catch (error) {
    if (apiBase && window.location.protocol === 'file:') {
      throw new Error('The local backend is not responding. Check that node server.js is running on port 3000 and refresh the page.');
    }
    throw error;
  }
}

function getLocalStaffSession(username, password) {
  const account = findStaffAccount(username);
  if (!account || account.password !== password) {
    return null;
  }

  const profile = getStaffProfile(account.username) || {};
  const status = profile.status || 'Active';
  if (status !== 'Active') {
    return null;
  }

  return { ...account, ...profile, status };
}

async function syncFromServer() {
  try {
    const [warningsResponse, bansResponse, accountsResponse, profilesResponse] = await Promise.all([
      apiRequest('/api/warnings'),
      apiRequest('/api/bans'),
      apiRequest('/api/staff/accounts'),
      apiRequest('/api/staff/profiles')
    ]);

    if (warningsResponse && Array.isArray(warningsResponse.warnings)) {
      localStorage.setItem(warningsKey, JSON.stringify(warningsResponse.warnings));
    }
    if (bansResponse && Array.isArray(bansResponse.bans)) {
      localStorage.setItem(bansKey, JSON.stringify(bansResponse.bans));
    }
    if (accountsResponse && Array.isArray(accountsResponse.accounts)) {
      localStorage.setItem(staffAccountsKey, JSON.stringify(accountsResponse.accounts));
    }
    if (profilesResponse && profilesResponse.profiles && typeof profilesResponse.profiles === 'object') {
      localStorage.setItem(staffProfilesKey, JSON.stringify(profilesResponse.profiles));
    }

    renderWarnings();
    renderBans();
    populateManageStaffSelect();
  } catch (error) {
    console.warn('Server sync unavailable, using local data only:', error.message);
  }
}

const staffMembers = [
  {
    username: 'mcrnathan',
    userId: null,
    localImage: 'nathan.png',
    name: 'mcrnathan',
    category: 'Owner',
    role: 'Owner',
    title: 'Owner',
    bio: 'Founder and owner of Waypoint.',
  },
  {
    username: 'Rocanti',
    userId: null,
    localImage: 'Rocanti.png',
    name: 'Rocanti',
    category: 'Management',
    role: 'Senior Management',
    title: 'Senior Management',
    bio: 'Senior management leader for Waypoint.',
  },
  {
    username: 'Chowlty',
    userId: null,
    localImage: 'Chowlty.png',
    name: 'Chowlty',
    category: 'Management',
    role: 'Management',
    title: 'Management',
    bio: 'Management team member overseeing community operations.',
  },
  {
    username: 'MixBoss28',
    userId: null,
    localImage: 'Mixboss.png',
    name: 'MixBoss28',
    category: 'Management',
    role: 'Management',
    title: 'Management',
    bio: 'Management staff keeping Waypoint on track.',
  },
  {
    username: 'Seby17119',
    userId: null,
    localImage: 'Seby.png',
    name: 'Seby17119',
    category: 'Developer',
    role: 'Developer',
    title: 'Developer',
    bio: 'Developer working on game systems and updates.',
  },
  {
    username: 'ActualCheddar',
    userId: null,
    localImage: 'ActualCheddar.png',
    name: 'ActualCheddar',
    category: 'Developer',
    role: 'Developer',
    title: 'Developer',
    bio: 'Developer helping maintain and expand Waypoint.',
  },
  {
    username: 'xDeveloper_Jacobx',
    userId: null,
    localImage: 'jacob.png',
    name: 'xDeveloper_Jacobx',
    category: 'Management',
    role: 'Management',
    title: 'Management',
    bio: 'Management team member.',
  },
  {
    username: 'Vivacion',
    userId: null,
    localImage: 'Vivacion.png',
    name: 'Vivacion',
    category: 'Developer',
    role: 'Developer',
    title: 'Developer',
    bio: 'Developer team member.',
  },
];

function isValidEmailAddress(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function showResponse(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.style.display = message ? 'block' : 'none';
  element.style.background = isError ? 'rgba(255, 111, 68, 0.12)' : 'rgba(63, 141, 255, 0.12)';
  element.style.borderColor = isError ? 'rgba(255, 111, 68, 0.3)' : 'rgba(63, 141, 255, 0.3)';
}

function getRobloxAvatarUrl(userId, size = 420) {
  return `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=${size}&height=${size}&format=png`;
}

function renderStaffCards(container, members) {
  if (!container) return;
  container.innerHTML = members
    .map(member => {
      const color = roleColorMap[member.role] || '#7c3aed';
      const avatarSrc = member.localImage ? `/images/${member.localImage}` : getRobloxAvatarUrl(member.userId || 0, 150);
      return `
      <article class="staff-card team-card">
        <img class="team-avatar" src="${avatarSrc}" alt="${member.name} avatar" />
        <div class="team-body">
          <h3>${member.name}</h3>
          <p class="team-title">${member.title}</p>
          <span class="role-pill" style="background:${color};">${member.role}</span>
          <p class="team-bio">${member.bio}</p>
        </div>
      </article>
    `;
    })
    .join('');
}

function getActiveStaffDirectory() {
  const accounts = getStaffAccounts();
  const profiles = getStaffProfiles();

  return accounts
    .filter(account => {
      const profile = profiles[account.username.toLowerCase()] || {};
      const status = profile.status || account.status || 'Active';
      return status !== 'Resigned' && status !== 'Deactivated';
    })
    .map(account => {
      const profile = profiles[account.username.toLowerCase()] || {};
      const existing = staffMembers.find(member => member.username.toLowerCase() === account.username.toLowerCase());
      const role = account.role || 'Management';
      return {
        username: account.username,
        userId: existing?.userId ?? robloxIdCache[account.username.toLowerCase()] ?? null,
        localImage: existing?.localImage ?? null,
        name: account.displayName || account.username,
        category: role === 'Owner' ? 'Owner' : role === 'Developer' ? 'Developer' : role,
        role,
        title: role,
        bio: existing?.bio || `${role} team member.`
      };
    });
}

function renderTeamCategories() {
  const members = getActiveStaffDirectory();
  if (!teamCategories) return;
  const categories = [...new Set(members.map(member => member.category))];
  if (!categories.length) {
    teamCategories.innerHTML = '<p class="response-box">No active staff members available right now.</p>';
    return;
  }

  teamCategories.innerHTML = categories
    .map(category => {
      const filteredMembers = members.filter(member => member.category === category);
      return `
      <section class="team-category">
        <h2>${category}</h2>
        <div class="team-grid">
          ${filteredMembers
            .map(member => {
              const color = roleColorMap[member.role] || '#7c3aed';
              return `
              <article class="staff-card team-card">
                <img class="team-avatar" src="${member.localImage ? `/images/${member.localImage}` : getRobloxAvatarUrl(member.userId || 0, 150)}" alt="${member.name} avatar" />
                <div class="team-body">
                  <h3>${member.name}</h3>
                  <p class="team-title">${member.title}</p>
                  <span class="role-pill" style="background:${color};">${member.role}</span>
                  <p class="team-bio">${member.bio}</p>
                </div>
              </article>
            `;
            })
            .join('')}
        </div>
      </section>
    `;
    })
    .join('');
}

function getFormerStaffDirectory() {
  const accounts = getStaffAccounts();
  const profiles = getStaffProfiles();

  return accounts
    .filter(account => {
      const profile = profiles[account.username.toLowerCase()] || {};
      const status = profile.status || account.status || 'Active';
      return status === 'Resigned' || status === 'Deactivated' || status === 'On Leave';
    })
    .map(account => {
      const profile = profiles[account.username.toLowerCase()] || {};
      const existing = staffMembers.find(member => member.username.toLowerCase() === account.username.toLowerCase());
      const role = account.role || 'Developer';
      const status = profile.status || account.status || 'Former';
      return {
        username: account.username,
        userId: existing?.userId ?? robloxIdCache[account.username.toLowerCase()] ?? null,
        localImage: existing?.localImage ?? null,
        name: account.displayName || account.username,
        role,
        title: role,
        status,
        bio: existing?.bio || `${role} staff member.`
      };
    });
}

function renderFormerStaff() {
  if (!formerStaff) return;
  const formerMembers = getFormerStaffDirectory();

  if (!formerMembers.length) {
    formerStaff.innerHTML = '<p class="response-box">No former staff members have been recorded yet.</p>';
    return;
  }

  formerStaff.innerHTML = `
    <section class="team-category">
      <h2>Former Staff</h2>
      <div class="team-grid">
        ${formerMembers
          .map(member => {
            const color = roleColorMap[member.role] || '#7c3aed';
            return `
              <article class="staff-card team-card">
                <img class="team-avatar" src="${member.localImage ? `/images/${member.localImage}` : getRobloxAvatarUrl(member.userId || 0, 150)}" alt="${member.name} avatar" />
                <div class="team-body">
                  <h3>${member.name}</h3>
                  <p class="team-title">${member.title}</p>
                  <span class="role-pill" style="background:${color};">${member.role}</span>
                  <p class="team-bio">${member.status} · ${member.bio}</p>
                </div>
              </article>
            `;
          })
          .join('')}
      </div>
    </section>
  `;
}

function getStaffSession() {
  const stored = localStorage.getItem(staffSessionKey);
  return stored ? JSON.parse(stored) : null;
}

function setStaffSession(session) {
  localStorage.setItem(staffSessionKey, JSON.stringify(session));
}

function clearStaffSession() {
  localStorage.removeItem(staffSessionKey);
}

function getStaffProfiles() {
  const stored = localStorage.getItem(staffProfilesKey);
  return stored ? JSON.parse(stored) : {};
}

function saveStaffProfiles(profiles) {
  localStorage.setItem(staffProfilesKey, JSON.stringify(profiles));
}

function getStaffProfile(username) {
  const profiles = getStaffProfiles();
  return profiles[username.toLowerCase()] || null;
}

function updateStaffProfile(username, updates) {
  const profiles = getStaffProfiles();
  const existing = profiles[username.toLowerCase()] || {};
  profiles[username.toLowerCase()] = { ...existing, ...updates };
  saveStaffProfiles(profiles);
}

function getStaffAccounts() {
  const stored = localStorage.getItem(staffAccountsKey);
  return stored ? JSON.parse(stored) : staffAccounts.map(account => ({ ...account }));
}

function saveStaffAccounts(accounts) {
  localStorage.setItem(staffAccountsKey, JSON.stringify(accounts));
}

function findStaffAccount(username) {
  const accounts = getStaffAccounts();
  return accounts.find(account => account.username.toLowerCase() === username.toLowerCase()) || null;
}

function updateStaffAccount(username, updates) {
  const accounts = getStaffAccounts();
  const index = accounts.findIndex(account => account.username.toLowerCase() === username.toLowerCase());
  if (index === -1) return null;
  accounts[index] = { ...accounts[index], ...updates };
  saveStaffAccounts(accounts);
  return accounts[index];
}

function createStaffAccount(newAccount) {
  const accounts = getStaffAccounts();
  const existing = accounts.find(account => account.username.toLowerCase() === newAccount.username.toLowerCase());
  if (existing) return false;
  accounts.push(newAccount);
  saveStaffAccounts(accounts);
  return true;
}

function initializeStaffAccounts() {
  if (!localStorage.getItem(staffAccountsKey)) {
    saveStaffAccounts(staffAccounts.map(account => ({ ...account })));
  }
}

async function refreshServerStaffAccounts() {
  try {
    const [accountsResponse, profilesResponse] = await Promise.all([
      apiRequest('/api/staff/accounts'),
      apiRequest('/api/staff/profiles')
    ]);

    if (accountsResponse && Array.isArray(accountsResponse.accounts)) {
      saveStaffAccounts(accountsResponse.accounts);
    }
    if (profilesResponse && profilesResponse.profiles && typeof profilesResponse.profiles === 'object') {
      saveStaffProfiles(profilesResponse.profiles);
    }

    populateManageStaffSelect();
    if (getStaffSession()) {
      updateStaffDashboard();
    }
  } catch (error) {
    console.warn('Could not refresh staff accounts from server:', error.message);
  }
}

function getWarnings() {
  const stored = localStorage.getItem(warningsKey);
  return stored ? JSON.parse(stored) : [];
}

function saveWarnings(warnings) {
  localStorage.setItem(warningsKey, JSON.stringify(warnings));
}

function getBans() {
  const stored = localStorage.getItem(bansKey);
  return stored ? JSON.parse(stored) : [];
}

function saveBans(bans) {
  localStorage.setItem(bansKey, JSON.stringify(bans));
}

function renderWarnings() {
  if (!warningsList) return;
  const warnings = getWarnings();
  if (!warnings.length) {
    warningsList.innerHTML = '<p class="response-box">No warnings have been issued yet.</p>';
    return;
  }

  const recentWarnings = [...warnings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  warningsList.innerHTML = `
    <div class="recent-moderation-list">
      ${recentWarnings
        .map((warning, index) => {
          const rank = recentWarnings.length - index;
          return `
            <article class="recent-moderation-item warning-item">
              <div class="moderation-rank">#${rank}</div>
              <div class="moderation-body">
                <div class="moderation-topline">
                  <strong>${warning.username}</strong>
                  <span>${warning.issuedBy}</span>
                </div>
                <p>${warning.reason}</p>
                <small>${warning.createdAt}</small>
              </div>
            </article>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderBans() {
  if (!bansList) return;
  const bans = getBans();
  const session = getStaffSession();
  const allowRevoke = session && session.level >= 3;

  if (!bans.length) {
    bansList.innerHTML = '<p class="response-box">No bans have been issued yet.</p>';
    return;
  }

  const recentBans = [...bans]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  bansList.innerHTML = `
    <div class="recent-moderation-list">
      ${recentBans
        .map((ban, index) => {
          const rank = recentBans.length - index;
          return `
            <article class="recent-moderation-item ban-item">
              <div class="moderation-rank">#${rank}</div>
              <div class="moderation-body">
                <div class="moderation-topline">
                  <strong>${ban.username}</strong>
                  <span>${ban.duration}</span>
                </div>
                <p>${ban.reason}</p>
                <small>${ban.issuedBy} · ${ban.createdAt}</small>
                ${allowRevoke ? `<button class="btn btn-secondary revoke-ban-btn" data-ban-id="${ban.id}" type="button">Revoke Ban</button>` : ''}
              </div>
            </article>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderStaffStatus() {
  const session = getStaffSession();
  if (staffLoginBtn) {
    if (session) {
      staffLoginBtn.textContent = 'Logout';
      staffLoginBtn.classList.remove('btn-secondary');
      staffLoginBtn.classList.add('btn-primary');
    } else {
      staffLoginBtn.textContent = 'Staff Login';
      staffLoginBtn.classList.remove('btn-primary');
      staffLoginBtn.classList.add('btn-secondary');
    }
  }
  if (staffPanelBtn) {
    staffPanelBtn.style.display = session ? 'inline-flex' : 'none';
  }
  if (staffStatusText) {
    staffStatusText.textContent = session ? `Logged in as ${session.displayName}` : '';
  }
}

function populateStaffSettings() {
  const session = getStaffSession();
  if (!session || !staffSettingsForm) return;
  if (staffEmailInput) staffEmailInput.value = session.email || '';
  if (staffBirthdayInput) staffBirthdayInput.value = session.birthday || '';
  if (staffAccountStatus) staffAccountStatus.textContent = `Status: ${session.status || 'Active'}`;
}

function renderBirthdayBanner() {
  if (!birthdayBanner || !birthdayBannerText) return;
  const session = getStaffSession();
  const today = new Date();
  const currentMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const birthdaysToday = getStaffAccounts().filter(account => account.birthday && account.birthday.slice(5) === currentMonthDay);

  if (session && session.birthday && session.birthday.slice(5) === currentMonthDay) {
    birthdayBannerText.textContent = `Happy Birthday to ${session.displayName} from our ${session.role} team!`;
    birthdayBanner.style.display = 'block';
    return;
  }

  if (!birthdaysToday.length) {
    birthdayBanner.style.display = 'none';
    return;
  }

  const names = birthdaysToday.map(account => account.displayName || account.username);
  if (names.length === 1) {
    birthdayBannerText.textContent = `Today is ${names[0]}'s birthday! Wish them a great day from the Waypoint staff.`;
  } else {
    const lastName = names.pop();
    birthdayBannerText.textContent = `Today we celebrate ${names.join(', ')} and ${lastName} — happy birthday from the Waypoint staff!`;
  }
  birthdayBanner.style.display = 'block';
}

const staffNotesKey = 'waypointStaffNotes';

function getStaffNotes() {
  const stored = localStorage.getItem(staffNotesKey);
  return stored ? JSON.parse(stored) : {};
}

function saveStaffNotes(notes) {
  localStorage.setItem(staffNotesKey, JSON.stringify(notes));
}

function addStaffNote(username, note, issuedBy) {
  const notes = getStaffNotes();
  const key = username.toLowerCase();
  notes[key] = notes[key] || [];
  notes[key].unshift({ note, issuedBy, date: new Date().toLocaleString() });
  saveStaffNotes(notes);
}

function populateManageStaffSelect(preserveUsername) {
  if (!manageStaffUsername) return;
  const previousValue = preserveUsername !== undefined ? preserveUsername : manageStaffUsername.value;
  const accounts = getStaffAccounts();
  manageStaffUsername.innerHTML = `<option value="">Choose staff</option>` + accounts
    .map(account => `<option value="${account.username}">${account.displayName || account.username} (${account.role})</option>`)
    .join('');
  if (previousValue && accounts.some(account => account.username === previousValue)) {
    manageStaffUsername.value = previousValue;
  }
}

function updateManagementVisibility() {
  if (!staffManagementPanel) return;
  const session = getStaffSession();
  staffManagementPanel.style.display = session && session.level >= 3 ? 'block' : 'none';
}

function renderSelectedStaffManagementInfo(username) {
  if (!manageStaffResult || !manageStaffRoleLabel || !manageStaffStatusLabel || !manageStaffTeamLabel) return;
  const account = findStaffAccount(username);
  if (!account) {
    manageStaffRoleLabel.textContent = '—';
    manageStaffStatusLabel.textContent = '—';
    manageStaffTeamLabel.textContent = '—';
    manageStaffResult.innerHTML = '<p class="staff-panel-note">Select a staff member to see their profile and history.</p>';
    return;
  }

  const profile = getStaffProfile(account.username) || {};
  const status = profile.status || account.status || 'Active';
  manageStaffRoleLabel.textContent = account.role;
  manageStaffStatusLabel.textContent = status;
  manageStaffTeamLabel.textContent = account.role;

  const notes = getStaffNotes()[account.username.toLowerCase()] || [];
  const notesHtml = notes.length
    ? `<div class="staff-record-list">${notes.map(item => `
        <article class="staff-record-item">
          <p>${item.note}</p>
          <p class="record-item-submeta">By ${item.issuedBy} · ${item.date}</p>
        </article>
      `).join('')}</div>`
    : '<p class="staff-panel-note">No notes yet for this staff member.</p>';

  manageStaffResult.innerHTML = `
    <div class="staff-panel-note">
      <p><strong>Username:</strong> ${account.username}</p>
      <p><strong>Email:</strong> ${profile.email || 'Not set'}</p>
      <p><strong>Birthday:</strong> ${profile.birthday || 'Not set'}</p>
    </div>
    <div class="management-notes">${notesHtml}</div>
  `;
}

function resetManagementActionSections() {
  const teamSection = document.querySelector('.action-section.action-team');
  const noteSection = document.querySelector('.action-section.action-note');
  const warningSection = document.querySelector('.action-section.action-warning');
  const suspendSection = document.querySelector('.action-section.action-suspend');
  if (teamSection) teamSection.style.display = 'none';
  if (noteSection) noteSection.style.display = 'grid';
  if (warningSection) warningSection.style.display = 'none';
  if (suspendSection) suspendSection.style.display = 'none';
  if (managementNoteText) managementNoteText.value = '';
  if (managementWarningText) managementWarningText.value = '';
}

function updateStaffWelcomeClock() {
  const session = getStaffSession();
  const now = new Date();
  const hour = now.getHours();
  const minute = String(now.getMinutes()).padStart(2, '0');
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(now);

  if (staffDateText) {
    staffDateText.textContent = dateLabel;
  }

  if (staffTimeText) {
    staffTimeText.textContent = `${String(hour).padStart(2, '0')}:${minute}`;
  }

  if (staffGreetingText) {
    const name = session ? (session.displayName || session.username || 'Staff Member') : 'Staff Member';
    const timeMessage = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'night';
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    staffGreetingText.textContent = `${greeting}, ${name}! Have a wonderful ${timeMessage}.`;
  }
}

function updateStaffDashboard() {
  const session = getStaffSession();
  renderStaffStatus();
  renderBirthdayBanner();
  updateStaffWelcomeClock();
  if (!staffDashboard) return;
  if (!session) {
    staffDashboard.style.display = 'none';
  } else {
    staffDashboard.style.display = 'block';
    if (staffDashboardUser) staffDashboardUser.textContent = `User: ${session.displayName}`;
  }
  if (staffDashboardRole) {
    staffDashboardRole.textContent = session ? `Role: ${session.role}` : '';
  }
  if (ownerCreateAccount) {
    ownerCreateAccount.style.display = session && session.level === 4 ? 'block' : 'none';
  }
  updateManagementVisibility();
  populateManageStaffSelect();
  renderSelectedStaffManagementInfo(manageStaffUsername ? manageStaffUsername.value : '');
  renderWarnings();
  renderBans();
  renderTeamCategories();
  populateStaffSettings();
}

function isStaffRoute() {
  const pathname = window.location.pathname.toLowerCase();
  return pathname === '/staff' || pathname.endsWith('/staff') || pathname === '/staff.html' || pathname.endsWith('/staff.html');
}

function handleStaffRouteAccess() {
  const session = getStaffSession();
  if (!isStaffRoute()) return;

  const lockedPanel = document.getElementById('staffAccessLocked');
  const dashboard = document.getElementById('staffDashboard');
  const loginPrompt = document.getElementById('staffLoginPrompt');

  if (!session) {
    if (lockedPanel) lockedPanel.style.display = 'block';
    if (dashboard) dashboard.style.display = 'none';
    if (loginPrompt) {
      loginPrompt.style.display = 'block';
      loginPrompt.innerHTML = '<p>Access restricted. Staff-only portal. Please log in to continue.</p>';
    }
    openStaffLogin();
    return;
  }

  if (lockedPanel) lockedPanel.style.display = 'none';
  if (dashboard) dashboard.style.display = 'block';
  if (loginPrompt) loginPrompt.style.display = 'none';
}

function openStaffLogin() {
  if (!staffLoginModal) return;
  staffLoginModal.style.display = 'flex';
  staffLoginModal.setAttribute('aria-hidden', 'false');
}

function closeStaffLogin(keepMessage = false) {
  if (!staffLoginModal) return;
  staffLoginModal.style.display = 'none';
  staffLoginModal.setAttribute('aria-hidden', 'true');
  if (staffLoginMessage && !keepMessage) {
    staffLoginMessage.style.display = 'none';
    staffLoginMessage.textContent = '';
  }
}

function setupStaffEventHandlers() {
  if (staffLoginBtn) {
    staffLoginBtn.addEventListener('click', () => {
      if (getStaffSession()) {
        clearStaffSession();
        updateStaffDashboard();
        if (staffLoginMessage) {
          staffLoginMessage.style.display = 'block';
          staffLoginMessage.textContent = 'Logged out successfully.';
        }
        if (window.location.pathname === '/staff' || window.location.pathname === '/staff.html') {
        window.location.href = '/index.html';
        return;
      }
      window.location.href = '/index.html';
      return;
    }
    openStaffLogin();
  });
}

  if (staffPanelBtn) {
    staffPanelBtn.addEventListener('click', () => {
      window.location.href = '/staff-hub.html';
    });
  }

  const staffPortalLoginBtn = document.getElementById('staffPortalLoginBtn');
  if (staffPortalLoginBtn) {
    staffPortalLoginBtn.addEventListener('click', () => {
      openStaffLogin();
    });
  }

  if (staffModalClose) {
    staffModalClose.addEventListener('click', closeStaffLogin);
  }

  if (passwordVisibilityToggle) {
    passwordVisibilityToggle.addEventListener('click', () => {
      const passwordInput = document.getElementById('staffPassword');
      if (!passwordInput) return;
      const isHidden = passwordInput.type === 'password';
      passwordInput.type = isHidden ? 'text' : 'password';
      passwordVisibilityToggle.textContent = isHidden ? 'Hide' : 'Show';
      passwordVisibilityToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
  }

  if (staffLoginForm) {
    staffLoginForm.addEventListener('submit', async event => {
      event.preventDefault();
      const username = document.getElementById('staffUsername').value.trim();
      const password = document.getElementById('staffPassword').value.trim();

      try {
        const response = await apiRequest('/api/staff/login', {
          method: 'POST',
          body: JSON.stringify({ username, password })
        });

        const sessionData = response.session;
        setStaffSession(sessionData);
        if (staffLoginMessage) {
          staffLoginMessage.style.display = 'block';
          staffLoginMessage.textContent = `Logged in as ${sessionData.displayName}.`;
        }
        closeStaffLogin(true);
        window.location.href = '/staff-hub.html';
        return;
      } catch (error) {
        const fallbackSession = getLocalStaffSession(username, password);
        if (fallbackSession) {
          setStaffSession(fallbackSession);
          if (staffLoginMessage) {
            staffLoginMessage.style.display = 'block';
            staffLoginMessage.textContent = `Logged in as ${fallbackSession.displayName} (local fallback).`;
          }
          closeStaffLogin(true);
          window.location.href = '/staff-hub.html';
          return;
        }

        if (staffLoginMessage) {
          staffLoginMessage.style.display = 'block';
          staffLoginMessage.textContent = error.message || 'Invalid staff credentials. Please try again.';
        }
      }
    });
  }

  if (manageStaffUsername) {
    manageStaffUsername.addEventListener('change', () => {
      renderSelectedStaffManagementInfo(manageStaffUsername.value);
    });
  }

  function updateActionSection() {
    if (!manageStaffAction) return;
    const action = manageStaffAction.value;
    const noteSection = document.querySelector('.action-section.action-note');
    const warningSection = document.querySelector('.action-section.action-warning');
    const suspendSection = document.querySelector('.action-section.action-suspend');
    const teamSection = document.querySelector('.action-section.action-team');

    if (noteSection) noteSection.style.display = action === 'note' ? 'grid' : 'none';
    if (warningSection) warningSection.style.display = action === 'warning' ? 'grid' : 'none';
    if (suspendSection) suspendSection.style.display = action === 'suspend' ? 'grid' : 'none';
    if (teamSection) teamSection.style.display = action === 'changeRole' ? 'grid' : 'none';
  }

  if (manageStaffAction) {
    manageStaffAction.addEventListener('change', updateActionSection);
    updateActionSection();
  }

  if (manageStaffApply) {
    manageStaffApply.addEventListener('click', async () => {
      const session = getStaffSession();
      if (!session || session.level < 3) {
        showResponse(staffDashboardMessage, 'Only management and above can perform staff actions.', true);
        return;
      }
      const username = manageStaffUsername ? manageStaffUsername.value : '';
      if (!username) {
        showResponse(staffDashboardMessage, 'Choose a staff member first.', true);
        return;
      }
      const account = findStaffAccount(username);
      if (!account) {
        showResponse(staffDashboardMessage, 'This staff user could not be found.', true);
        return;
      }
      const action = manageStaffAction ? manageStaffAction.value : 'note';
      try {
        if (action === 'note') {
          const note = managementNoteText ? managementNoteText.value.trim() : '';
          if (!note) {
            showResponse(staffDashboardMessage, 'Enter a note before saving.', true);
            return;
          }
          await apiRequest('/api/staff/notes', {
            method: 'POST',
            body: JSON.stringify({ username, note, issuedBy: session.displayName })
          });
          showResponse(staffDashboardMessage, `Note added to ${username}.`);
        }
        if (action === 'warning') {
          const warning = managementWarningText ? managementWarningText.value.trim() : '';
          if (!warning) {
            showResponse(staffDashboardMessage, 'Enter a staff warning reason before saving.', true);
            return;
          }
          await apiRequest('/api/staff/notes', {
            method: 'POST',
            body: JSON.stringify({ username, note: `[STAFF WARNING] ${warning}`, issuedBy: session.displayName })
          });
          showResponse(staffDashboardMessage, `Staff warning logged for ${username}.`);
        }
        if (action === 'suspend') {
          const duration = managementSuspendDuration ? managementSuspendDuration.value : '1 day';
          await apiRequest(`/api/staff/accounts/${encodeURIComponent(username)}`, {
            method: 'PUT',
            body: JSON.stringify({ status: `Suspended (${duration})` })
          });
          updateStaffProfile(username, { status: `Suspended (${duration})` });
          showResponse(staffDashboardMessage, `${username} has been suspended for ${duration}.`);
        }
        if (action === 'deactivate') {
          await apiRequest(`/api/staff/accounts/${encodeURIComponent(username)}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'Deactivated' })
          });
          updateStaffProfile(username, { status: 'Deactivated' });
          showResponse(staffDashboardMessage, `${username} has been deactivated.`);
        }
        if (action === 'reactivate') {
          await apiRequest(`/api/staff/accounts/${encodeURIComponent(username)}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'Active' })
          });
          updateStaffProfile(username, { status: 'Active' });
          showResponse(staffDashboardMessage, `${username} has been reactivated.`);
        }
        if (action === 'changeRole') {
          const newRole = manageTeamRole ? manageTeamRole.value : '';
          if (!newRole) {
            showResponse(staffDashboardMessage, 'Select a new team role before applying.', true);
            return;
          }
          await apiRequest(`/api/staff/accounts/${encodeURIComponent(username)}`, {
            method: 'PUT',
            body: JSON.stringify({ role: newRole })
          });
          showResponse(staffDashboardMessage, `${username} was moved to ${newRole}.`);
        }

        await refreshServerStaffAccounts();
        populateManageStaffSelect();
        renderSelectedStaffManagementInfo(username);
        updateStaffDashboard();
      } catch (error) {
        showResponse(staffDashboardMessage, error.message || 'Staff action failed.', true);
      }
    });
  }

  if (manageStaffClear) {
    manageStaffClear.addEventListener('click', () => {
      if (manageStaffUsername) manageStaffUsername.value = '';
      if (manageStaffAction) manageStaffAction.value = 'note';
      resetManagementActionSections();
      renderSelectedStaffManagementInfo('');
    });
  }

  function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  const openWarningHandlers = [openWarningBtn, openWarningBtnSecondary].filter(Boolean);
  openWarningHandlers.forEach(button => {
    button.addEventListener('click', () => openModal(warningModal));
  });

  const openBanHandlers = [openBanBtn, openBanBtnSecondary].filter(Boolean);
  openBanHandlers.forEach(button => {
    button.addEventListener('click', () => openModal(banModal));
  });

  if (closeWarningModalBtn) {
    closeWarningModalBtn.addEventListener('click', () => closeModal(warningModal));
  }
  if (closeBanModalBtn) {
    closeBanModalBtn.addEventListener('click', () => closeModal(banModal));
  }

  if (warningModalForm) {
    warningModalForm.addEventListener('submit', async event => {
      event.preventDefault();
      const username = warningModalUsername ? warningModalUsername.value.trim() : '';
      const reason = warningModalReason ? warningModalReason.value.trim() : '';
      const evidence = warningModalEvidence ? warningModalEvidence.value.trim() : '';
      const session = getStaffSession();
      if (!username || !reason || !session) {
        showResponse(staffDashboardMessage, 'Please enter a username and reason before saving.', true);
        return;
      }

      try {
        await apiRequest('/api/warnings', {
          method: 'POST',
          body: JSON.stringify({
            username,
            reason,
            evidence,
            issuedBy: session.displayName
          })
        });
        await syncFromServer();
        showResponse(staffDashboardMessage, `Warning issued to ${username}.`);
        warningModalForm.reset();
        closeModal(warningModal);
      } catch (error) {
        showResponse(staffDashboardMessage, error.message || 'Warning could not be created.', true);
      }
    });
  }

  if (banModalForm) {
    banModalForm.addEventListener('submit', async event => {
      event.preventDefault();
      const username = banModalUsername ? banModalUsername.value.trim() : '';
      const reason = banModalReason ? banModalReason.value.trim() : '';
      const evidence = banModalEvidence ? banModalEvidence.value.trim() : '';
      const duration = banModalDuration ? banModalDuration.value : 'Permanent';
      const session = getStaffSession();
      if (!username || !reason || !session) {
        showResponse(staffDashboardMessage, 'Please enter a username and reason before saving.', true);
        return;
      }

      try {
        await apiRequest('/api/bans', {
          method: 'POST',
          body: JSON.stringify({
            username,
            reason,
            evidence,
            duration,
            issuedBy: session.displayName
          })
        });
        await syncFromServer();
        showResponse(staffDashboardMessage, `Ban issued for ${username}.`);
        banModalForm.reset();
        closeModal(banModal);
      } catch (error) {
        showResponse(staffDashboardMessage, error.message || 'Ban could not be created.', true);
      }
    });
  }

  if (recordSearchForm) {
    recordSearchForm.addEventListener('submit', async event => {
      event.preventDefault();
      const username = recordSearchUsername ? recordSearchUsername.value.trim() : '';
      if (!username) return;

      try {
        const response = await apiRequest(`/api/records?username=${encodeURIComponent(username)}`);
        const warnings = response.warnings || [];
        const bans = response.bans || [];
        const account = response.account || findStaffAccount(username);
        let resultHtml = `<div class="record-search-summary"><p><strong>Search results for:</strong> ${username}</p>`;
        resultHtml += `<p><strong>Staff account:</strong> ${account ? account.role : 'Not on staff'}</p></div>`;
        if (bans.length) {
          resultHtml += '<div class="record-search-section"><h4>Bans</h4>' + bans.map(ban => `
            <div class="staff-record-item">
              <p><strong>Issued by:</strong> ${ban.issuedBy}</p>
              <p><strong>Reason:</strong> ${ban.reason}</p>
              <p><strong>Duration:</strong> ${ban.duration}</p>
              <p><strong>Evidence:</strong> ${ban.evidence || 'None provided'}</p>
              <p><strong>Date:</strong> ${ban.createdAt}</p>
            </div>
          `).join('') + '</div>';
        }
        if (warnings.length) {
          resultHtml += '<div class="record-search-section"><h4>Warnings</h4>' + warnings.map(warning => `
            <div class="staff-record-item">
              <p><strong>Issued by:</strong> ${warning.issuedBy}</p>
              <p><strong>Reason:</strong> ${warning.reason}</p>
              <p><strong>Evidence:</strong> ${warning.evidence || 'None provided'}</p>
              <p><strong>Date:</strong> ${warning.createdAt}</p>
            </div>
          `).join('') + '</div>';
        }
        if (!bans.length && !warnings.length) {
          resultHtml += '<div class="response-box">No active bans or warnings found for this username.</div>';
        }
        if (recordSearchResult) {
          recordSearchResult.innerHTML = resultHtml;
        }
      } catch (error) {
        if (recordSearchResult) {
          recordSearchResult.innerHTML = `<div class="response-box">Unable to fetch record data for ${username}.</div>`;
        }
      }
    });
  }

  if (bansList) {
    bansList.addEventListener('click', async event => {
      const button = event.target.closest('.revoke-ban-btn');
      if (!button) return;
      const banId = button.dataset.banId;
      const session = getStaffSession();
      if (!session || session.level < 3) {
        showResponse(staffDashboardMessage, 'Only management and above can revoke bans.', true);
        return;
      }
      if (!banId) return;

      try {
        await apiRequest(`/api/bans/${encodeURIComponent(banId)}`, {
          method: 'DELETE',
          body: JSON.stringify({ issuedBy: session.displayName, issuerLevel: session.level })
        });
        await syncFromServer();
        showResponse(staffDashboardMessage, 'Ban revoked successfully.');
      } catch (error) {
        showResponse(staffDashboardMessage, error.message || 'Unable to revoke ban.', true);
      }
    });
  }

  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', async () => {
      const session = getStaffSession();
      if (!session) return;
      const current = currentPassword ? currentPassword.value.trim() : '';
      const next = newPassword ? newPassword.value.trim() : '';
      const confirm = confirmNewPassword ? confirmNewPassword.value.trim() : '';
      if (!current || !next || !confirm) {
        showResponse(staffDashboardMessage, 'Complete all password fields before updating.', true);
        return;
      }
      if (next !== confirm) {
        showResponse(staffDashboardMessage, 'New password and confirmation do not match.', true);
        return;
      }

      try {
        await apiRequest('/api/staff/password', {
          method: 'POST',
          body: JSON.stringify({
            username: session.username,
            currentPassword: current,
            newPassword: next
          })
        });
      } catch (error) {
        console.warn('Password API update failed, using local fallback:', error.message);
      }

      const account = findStaffAccount(session.username);
      if (account) {
        const updatedAccount = { ...account, password: next };
        updateStaffAccount(session.username, { password: next });
        const updatedSession = { ...session, password: next };
        setStaffSession(updatedSession);
        if (account.username.toLowerCase() === session.username.toLowerCase()) {
          const localAccounts = getStaffAccounts();
          const index = localAccounts.findIndex(item => item.username.toLowerCase() === session.username.toLowerCase());
          if (index !== -1) {
            localAccounts[index].password = next;
            saveStaffAccounts(localAccounts);
          }
        }
      }

      showResponse(staffDashboardMessage, 'Password updated successfully.');
      if (currentPassword) currentPassword.value = '';
      if (newPassword) newPassword.value = '';
      if (confirmNewPassword) confirmNewPassword.value = '';
    });
  }

  if (createStaffAccountForm) {
    createStaffAccountForm.addEventListener('submit', async event => {
      event.preventDefault();
      const session = getStaffSession();
      if (!session || session.level !== 4) {
        showResponse(staffDashboardMessage, 'Only the owner can create staff accounts.', true);
        return;
      }
      const username = newStaffUsername ? newStaffUsername.value.trim() : '';
      const password = newStaffPassword ? newStaffPassword.value.trim() : '';
      const role = newStaffRole ? newStaffRole.value : 'Management';
      if (!username || !password) {
        showResponse(staffDashboardMessage, 'Provide username and password for the new staff account.', true);
        return;
      }

      try {
        await apiRequest('/api/staff/accounts', {
          method: 'POST',
          body: JSON.stringify({
            username,
            password,
            displayName: username,
            role,
            level: role === 'Owner' ? 4 : role === 'Developer' ? 2 : 3,
            email: '',
            birthday: ''
          })
        });
        await refreshServerStaffAccounts();
        renderTeamCategories();
        refreshRobloxUsernames();
        showResponse(staffDashboardMessage, `New staff account created for ${username}.`);
        if (newStaffUsername) newStaffUsername.value = '';
        if (newStaffPassword) newStaffPassword.value = '';
      } catch (error) {
        showResponse(staffDashboardMessage, error.message || 'Could not create staff account.', true);
      }
    });
  }

  if (staffSettingsForm) {
    staffSettingsForm.addEventListener('submit', async event => {
      event.preventDefault();
      const session = getStaffSession();
      if (!session) return;
      const email = staffEmailInput ? staffEmailInput.value.trim() : '';
      const birthday = staffBirthdayInput ? staffBirthdayInput.value : '';

      try {
        await apiRequest('/api/staff/profile', {
          method: 'POST',
          body: JSON.stringify({ username: session.username, email, birthday })
        });
      } catch (error) {
        console.warn('Profile API save failed, using local fallback:', error.message);
      }

      const updatedProfile = { ...(getStaffProfile(session.username) || {}), email, birthday };
      updateStaffProfile(session.username, updatedProfile);
      const updatedSession = { ...session, email, birthday };
      setStaffSession(updatedSession);
      updateStaffDashboard();
      if (staffSettingsMessage) {
        staffSettingsMessage.style.display = 'block';
        staffSettingsMessage.textContent = 'Your Waypoint settings have been saved.';
      }
    });
  }

  if (leaveButton) {
    leaveButton.addEventListener('click', async () => {
      const session = getStaffSession();
      if (!session) return;

      const reason = window.prompt('Why are you taking a leave of absence? (Optional details)', 'Personal leave');
      if (reason === null) return;

      try {
        const payload = {
          username: session.username,
          displayName: session.displayName || session.username,
          reason: reason || 'Personal leave',
          startDate: new Date().toISOString().slice(0, 10),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          issuedBy: session.username
        };

        await apiRequest('/api/staff/loa', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        if (staffSettingsMessage) {
          staffSettingsMessage.style.display = 'block';
          staffSettingsMessage.textContent = 'Your leave of absence request has been submitted for management review.';
        }
      } catch (error) {
        console.warn('Leave-of-absence request failed, using local fallback:', error.message);
        const updatedSession = { ...session, status: 'Leave of Absence' };
        updateStaffProfile(session.username, { status: 'Leave of Absence' });
        setStaffSession(updatedSession);
        updateStaffDashboard();
        if (staffSettingsMessage) {
          staffSettingsMessage.style.display = 'block';
          staffSettingsMessage.textContent = 'Your staff status has been updated to Leave of Absence.';
        }
      }
    });
  }

  if (resignButton) {
    resignButton.addEventListener('click', async () => {
      const session = getStaffSession();
      if (!session) return;
      try {
        await apiRequest(`/api/staff/accounts/${encodeURIComponent(session.username)}`, {
          method: 'PUT',
          body: JSON.stringify({ status: 'Resigned' })
        });

        await refreshServerStaffAccounts();
        populateManageStaffSelect();
        renderSelectedStaffManagementInfo('');
        clearStaffSession();
        updateStaffDashboard();
        renderTeamCategories();
        if (staffSettingsMessage) {
          staffSettingsMessage.style.display = 'block';
          staffSettingsMessage.textContent = 'You have resigned and been removed from the active staff team.';
        }
      } catch (error) {
        if (staffSettingsMessage) {
          staffSettingsMessage.style.display = 'block';
          staffSettingsMessage.textContent = error.message || 'Unable to resign from the staff team.';
        }
      }
    });
  }

  if (recordSearchResult) {
    recordSearchResult.innerHTML = '<p class="staff-panel-note">Search for a player to load their profile and moderation records.</p>';
  }

  if (ownerCreateAccount) {
    ownerCreateAccount.style.display = 'none';
  }
}

async function refreshRobloxUsernames() {
  if (!teamCategories) return;
  const usernames = getActiveStaffDirectory().map(member => member.username);
  if (!usernames.length) return;
  const url = 'https://users.roblox.com/v1/usernames/users';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernames }),
    });

    if (!response.ok) throw new Error('Failed to fetch Roblox names');
    const data = await response.json();
    if (!data.data) throw new Error('Roblox API returned invalid data');

    data.data.forEach(user => {
      robloxIdCache[user.requestedUsername.toLowerCase()] = user.id;
    });
    staffMembers.forEach(member => {
      const id = robloxIdCache[member.username.toLowerCase()];
      if (id) member.userId = id;
    });

    renderTeamCategories();
  } catch (error) {
    if (teamError) {
      teamError.style.display = 'block';
      teamError.textContent = 'Live Roblox API is unavailable right now. Staff images still load normally.';
    }
    renderTeamCategories();
  }
}

if (checkGameAccessBtn) {
  checkGameAccessBtn.addEventListener('click', async () => {
    const username = gameJoinUsername ? gameJoinUsername.value.trim() : '';
    if (!username) {
      if (gameAccessMessage) {
        gameAccessMessage.style.display = 'block';
        gameAccessMessage.textContent = 'Enter a Roblox username to check access.';
        gameAccessMessage.style.background = 'rgba(255, 111, 68, 0.12)';
        gameAccessMessage.style.borderColor = 'rgba(255, 111, 68, 0.3)';
      }
      return;
    }

    try {
      const result = await apiRequest(`/api/check-join?username=${encodeURIComponent(username)}`);
      if (gameAccessMessage) {
        gameAccessMessage.style.display = 'block';
        if (result.canJoin) {
          gameAccessMessage.textContent = `${username} is allowed to join.`;
          gameAccessMessage.style.background = 'rgba(63, 141, 255, 0.12)';
          gameAccessMessage.style.borderColor = 'rgba(63, 141, 255, 0.3)';
        } else {
          gameAccessMessage.textContent = `${username} is banned and cannot join the game.`;
          gameAccessMessage.style.background = 'rgba(255, 111, 68, 0.12)';
          gameAccessMessage.style.borderColor = 'rgba(255, 111, 68, 0.3)';
        }
      }
    } catch (error) {
      if (gameAccessMessage) {
        gameAccessMessage.style.display = 'block';
        gameAccessMessage.textContent = error.message || 'Access check failed.';
        gameAccessMessage.style.background = 'rgba(255, 111, 68, 0.12)';
        gameAccessMessage.style.borderColor = 'rgba(255, 111, 68, 0.3)';
      }
    }
  });
}

if (playGameBtn) {
  playGameBtn.addEventListener('click', async () => {
    const username = gameJoinUsername ? gameJoinUsername.value.trim() : '';
    const targetUsername = username || 'Guest';

    try {
      const result = await apiRequest(`/api/check-join?username=${encodeURIComponent(targetUsername)}`);
      if (!result.canJoin) {
        if (gameAccessMessage) {
          gameAccessMessage.style.display = 'block';
          gameAccessMessage.textContent = `${targetUsername} is banned and cannot join the game.`;
          gameAccessMessage.style.background = 'rgba(255, 111, 68, 0.12)';
          gameAccessMessage.style.borderColor = 'rgba(255, 111, 68, 0.3)';
        }
        return;
      }

      window.open('https://www.roblox.com/games/96345241670545/Tyne-Wear', '_blank', 'noopener,noreferrer');
    } catch (error) {
      if (gameAccessMessage) {
        gameAccessMessage.style.display = 'block';
        gameAccessMessage.textContent = error.message || 'Unable to verify access right now.';
        gameAccessMessage.style.background = 'rgba(255, 111, 68, 0.12)';
        gameAccessMessage.style.borderColor = 'rgba(255, 111, 68, 0.3)';
      }
      window.open('https://www.roblox.com/games/96345241670545/Tyne-Wear', '_blank', 'noopener,noreferrer');
    }
  });
}

function updateCharCounts() {
  if (experienceCount && document.getElementById('applyExperience')) {
    experienceCount.textContent = document.getElementById('applyExperience').value.length;
  }
  if (whyCount && document.getElementById('applyWhy')) {
    whyCount.textContent = document.getElementById('applyWhy').value.length;
  }
}

if (applyButtons.length) {
  applyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const role = button.dataset.role;
      const roleSelect = document.getElementById('applyRole');
      if (roleSelect) {
        roleSelect.value = role;
      }
      const applySection = document.getElementById('applySection');
      if (applySection) {
        applySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

if (applyForm) {
  const applyContact = document.getElementById('applyContact');
  const applyPortfolio = document.getElementById('applyPortfolio');
  const applyExperience = document.getElementById('applyExperience');
  const applyWhy = document.getElementById('applyWhy');

  [applyExperience, applyWhy].forEach(textarea => {
    if (!textarea) return;
    textarea.addEventListener('input', updateCharCounts);
  });

  updateCharCounts();

  applyForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('applyName').value.trim();
    const contact = applyContact ? applyContact.value.trim() : '';
    const role = document.getElementById('applyRole').value;
    const portfolio = applyPortfolio ? applyPortfolio.value.trim() : '';
    const experience = applyExperience ? applyExperience.value.trim() : '';
    const why = applyWhy ? applyWhy.value.trim() : '';

    if (!name || !contact || !role || !portfolio || !experience || !why) {
      showResponse(applyResponse, 'Please complete every field before submitting your application.');
      return;
    }

    if (experience.length > 2000 || why.length > 2000) {
      showResponse(applyResponse, 'Please keep each long answer under 2000 characters.');
      return;
    }

    applyForm.reset();
    updateCharCounts();
    showResponse(applyResponse, `Thanks ${name}! Your ${role} application has been submitted. We will reach out via Discord soon.`);
  });
}

initializeStaffAccounts();
syncFromServer();
setupStaffEventHandlers();
handleStaffRouteAccess();
updateStaffDashboard();
updateStaffWelcomeClock();
setInterval(updateStaffWelcomeClock, 1000);
renderTeamCategories();
renderFormerStaff();
refreshRobloxUsernames();
