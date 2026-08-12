const ticketForm = document.getElementById('ticketForm');
const applyForm = document.getElementById('applyForm');
const applyButtons = document.querySelectorAll('.apply-now');
const ticketsList = document.getElementById('ticketsList');
const ticketResponse = document.getElementById('ticketResponse');
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
const staffDashboard = document.getElementById('staffDashboard');
const staffDashboardUser = document.getElementById('staffDashboardUser');
const staffDashboardRole = document.getElementById('staffDashboardRole');
const staffDashboardMessage = document.getElementById('staffDashboardMessage');
const staffTicketsList = document.getElementById('staffTicketsList');
const ticketDetailPanel = document.getElementById('ticketDetailPanel');
const ticketDetailTitle = document.getElementById('ticketDetailTitle');
const ticketDetailMeta = document.getElementById('ticketDetailMeta');
const ticketDetailMessage = document.getElementById('ticketDetailMessage');
const ticketCloseReason = document.getElementById('ticketCloseReason');
const ticketClosePresetBtn = document.getElementById('ticketClosePresetBtn');
const ticketDetailActions = document.getElementById('ticketDetailActions');
const ticketFilter = document.getElementById('ticketFilter');
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
let selectedTicketId = null;
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
const ticketCounterKey = 'waypointTicketCounter';
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
    const [ticketsResponse, warningsResponse, bansResponse, accountsResponse] = await Promise.all([
      apiRequest('/api/tickets'),
      apiRequest('/api/warnings'),
      apiRequest('/api/bans'),
      apiRequest('/api/staff/accounts')
    ]);

    if (ticketsResponse && Array.isArray(ticketsResponse.tickets)) {
      localStorage.setItem('waypointTickets', JSON.stringify(ticketsResponse.tickets));
    }
    if (warningsResponse && Array.isArray(warningsResponse.warnings)) {
      localStorage.setItem(warningsKey, JSON.stringify(warningsResponse.warnings));
    }
    if (bansResponse && Array.isArray(bansResponse.bans)) {
      localStorage.setItem(bansKey, JSON.stringify(bansResponse.bans));
    }
    if (accountsResponse && Array.isArray(accountsResponse.accounts)) {
      localStorage.setItem(staffAccountsKey, JSON.stringify(accountsResponse.accounts));
    }

    renderTickets();
    renderWarnings();
    renderBans();
    renderStaffTickets();
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
];

function getTickets() {
  const stored = localStorage.getItem('waypointTickets');
  return stored ? JSON.parse(stored) : [];
}

function saveTickets(tickets) {
  localStorage.setItem('waypointTickets', JSON.stringify(tickets));
}

function renderTickets() {
  if (!ticketsList) return;
  const tickets = getTickets();
  if (!tickets.length) {
    ticketsList.innerHTML = '<p class="response-box">No tickets submitted yet. Use the form above to open a ticket.</p>';
    return;
  }
  ticketsList.innerHTML = tickets
    .map(ticket => `
      <article class="ticket-item">
        <h3>${ticket.subject}</h3>
        <p><strong>Ticket #:</strong> ${ticket.number || ticket.id}</p>
        <p><strong>Name:</strong> ${ticket.name}</p>
        <p><strong>Contact:</strong> ${ticket.email}</p>
        <p><strong>Type:</strong> ${ticket.type || 'General'}</p>
        <p><strong>Status:</strong> <span class="ticket-status">${ticket.status || 'open'}</span></p>
        <p>${ticket.message}</p>
        <p><em>Ticket ID: ${ticket.id}</em></p>
        <p><a href="${ticket.url || '#'}" target="_blank" rel="noreferrer noopener">View staff ticket</a></p>
      </article>
    `)
    .join('');
}

function showResponse(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.style.display = message ? 'block' : 'none';
  element.style.background = isError ? 'rgba(255, 111, 68, 0.12)' : 'rgba(63, 141, 255, 0.12)';
  element.style.borderColor = isError ? 'rgba(255, 111, 68, 0.3)' : 'rgba(63, 141, 255, 0.3)';
}

function getTicketCounter() {
  const stored = localStorage.getItem(ticketCounterKey);
  return stored ? Number(stored) : 0;
}

function incrementTicketCounter() {
  const next = getTicketCounter() + 1;
  localStorage.setItem(ticketCounterKey, String(next));
  return next;
}

function createTicketId() {
  const ticketNumber = incrementTicketCounter();
  return {
    id: `WP-${String(ticketNumber).padStart(4, '0')}`,
    number: ticketNumber,
    url: `https://podrblx.co.uk/staff/ticket?ID=${ticketNumber}`,
  };
}

function getRobloxAvatarUrl(userId, size = 420) {
  return `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=${size}&height=${size}&format=png`;
}

function renderStaffCards(container, members) {
  if (!container) return;
  container.innerHTML = members
    .map(member => {
      const color = roleColorMap[member.role] || '#7c3aed';
      const avatarSrc = member.localImage ? `images/${member.localImage}` : getRobloxAvatarUrl(member.userId || 0, 150);
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
      const status = profile.status || 'Active';
      return status !== 'Resigned' && status !== 'Deactivated';
    })
    .map(account => {
      const profile = profiles[account.username.toLowerCase()] || {};
      const existing = staffMembers.find(member => member.username.toLowerCase() === account.username.toLowerCase());
      const role = account.role || 'Management';
      return {
        username: account.username,
        userId: existing?.userId ?? null,
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
                <img class="team-avatar" src="${member.localImage ? `images/${member.localImage}` : getRobloxAvatarUrl(member.userId || 0, 150)}" alt="${member.name} avatar" />
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

function getStaffSession() {
  const stored = localStorage.getItem(staffSessionKey);
  return stored ? JSON.parse(stored) : null;
}

function showTicketDetails(ticket) {
  if (!ticketDetailPanel || !ticketDetailTitle || !ticketDetailMeta || !ticketDetailMessage || !ticketClosePresetBtn) return;
  selectedTicketId = ticket.id;
  ticketDetailTitle.textContent = `${ticket.subject} — ${ticket.id}`;
  ticketDetailMeta.textContent = `${ticket.name} · ${ticket.email} · ${ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'No date provided'}`;
  ticketDetailMessage.textContent = ticket.message;
  ticketDetailPanel.style.display = 'block';
  ticketClosePresetBtn.disabled = ticket.status === 'resolved';
  ticketClosePresetBtn.textContent = ticket.status === 'resolved' ? 'Already closed' : 'Close ticket';
}

function clearTicketDetail() {
  if (!ticketDetailPanel) return;
  selectedTicketId = null;
  ticketDetailPanel.style.display = 'none';
}

function resolveSelectedTicket(reason) {
  if (!selectedTicketId) return;
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(ticket => ticket.id === selectedTicketId);
  if (ticketIndex === -1) return;
  tickets[ticketIndex].status = 'resolved';
  tickets[ticketIndex].resolutionReason = reason;
  saveTickets(tickets);
  renderStaffTickets();
  const ticket = tickets[ticketIndex];
  showTicketDetails(ticket);
  showResponse(staffDashboardMessage, `Ticket ${selectedTicketId} closed as ${reason}.`);
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
    const response = await apiRequest('/api/staff/accounts');
    if (response && Array.isArray(response.accounts)) {
      saveStaffAccounts(response.accounts);
      populateManageStaffSelect();
      if (getStaffSession()) {
        updateStaffDashboard();
      }
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

function renderStaffTickets() {
  if (!staffTicketsList) return;
  const staffSession = getStaffSession();
  const tickets = getTickets();
  const filterValue = ticketFilter ? ticketFilter.value : 'all';
  const filtered = tickets.filter(ticket => {
    if (filterValue === 'appeal') return ticket.type === 'Ban Appeal';
    if (filterValue === 'open') return ticket.status === 'open';
    if (filterValue === 'resolved') return ticket.status === 'resolved';
    return true;
  });

  if (!filtered.length) {
    staffTicketsList.innerHTML = '<p class="response-box">No tickets match the selected filter.</p>';
    return;
  }

  staffTicketsList.innerHTML = filtered
    .map(ticket => {
      const allowActions = staffSession && staffSession.level >= 3;
      const actionButtons = [];
      if (allowActions && ticket.status !== 'resolved') {
        actionButtons.push(`<button class="btn btn-secondary" data-action="resolve" data-ticket-id="${ticket.id}" type="button">Resolve</button>`);
      }
      if (allowActions && ticket.type === 'Ban Appeal' && ticket.status !== 'resolved') {
        actionButtons.push(`<button class="btn btn-secondary" data-action="reject-appeal" data-ticket-id="${ticket.id}" type="button">Reject Appeal</button>`);
      }
      return `
      <article class="staff-ticket-item" data-ticket-id="${ticket.id}" tabindex="0">
        <h4>${ticket.subject}</h4>
        <p class="ticket-item-submeta">${ticket.name} · ${ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'No date available'}</p>
        <p><strong>ID:</strong> ${ticket.id}</p>
        <p><strong>Type:</strong> ${ticket.type || 'General'}</p>
        <p><strong>Status:</strong> <span class="ticket-status">${ticket.status}</span></p>
        <p>${ticket.message}</p>
        <div class="staff-ticket-actions">${actionButtons.join('')}</div>
      </article>
    `;
    })
    .join('');
}

function renderWarnings() {
  if (!warningsList) return;
  const warnings = getWarnings();
  if (!warnings.length) {
    warningsList.innerHTML = '<p class="response-box">No warnings have been issued yet.</p>';
    return;
  }

  warningsList.innerHTML = warnings
    .map(warning => `
      <article class="staff-record-item">
        <h4>${warning.username}</h4>
        <p><strong>Issued by:</strong> ${warning.issuedBy}</p>
        <p><strong>Reason:</strong> ${warning.reason}</p>
        <p><strong>Date:</strong> ${warning.createdAt}</p>
      </article>
    `)
    .join('');
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

  bansList.innerHTML = bans
    .map(ban => `
      <article class="staff-record-item">
        <h4>${ban.username}</h4>
        <p><strong>Issued by:</strong> ${ban.issuedBy}</p>
        <p><strong>Reason:</strong> ${ban.reason}</p>
        <p><strong>Duration:</strong> ${ban.duration}</p>
        <p><strong>Date:</strong> ${ban.createdAt}</p>
        ${allowRevoke ? `<button class="btn btn-secondary revoke-ban-btn" data-ban-id="${ban.id}" type="button">Revoke Ban</button>` : ''}
      </article>
    `)
    .join('');
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

function populateManageStaffSelect() {
  if (!manageStaffUsername) return;
  const accounts = getStaffAccounts();
  manageStaffUsername.innerHTML = `<option value="">Choose staff</option>` + accounts
    .map(account => `<option value="${account.username}">${account.displayName || account.username} (${account.role})</option>`)
    .join('');
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
  manageStaffRoleLabel.textContent = account.role;
  manageStaffStatusLabel.textContent = profile.status || 'Active';
  manageStaffTeamLabel.textContent = account.role;

  const notes = getStaffNotes()[account.username.toLowerCase()] || [];
  const notesHtml = notes.length
    ? `<div class="staff-record-list">${notes.map(item => `
        <article class="staff-record-item">
          <p>${item.note}</p>
          <p class="ticket-item-submeta">By ${item.issuedBy} · ${item.date}</p>
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
  const suspendSection = document.querySelector('.action-section.action-suspend');
  if (teamSection) teamSection.style.display = 'none';
  if (noteSection) noteSection.style.display = 'grid';
  if (suspendSection) suspendSection.style.display = 'none';
  if (managementNoteText) managementNoteText.value = '';
}

function updateStaffDashboard() {
  const session = getStaffSession();
  renderStaffStatus();
  renderBirthdayBanner();
  if (!staffDashboard) return;
  if (!session) {
    staffDashboard.style.display = 'none';
    return;
  }
  staffDashboard.style.display = 'block';
  if (staffDashboardUser) staffDashboardUser.textContent = `User: ${session.displayName}`;
  if (staffDashboardRole) staffDashboardRole.textContent = `Role: ${session.role}`;
  if (ownerCreateAccount) {
    ownerCreateAccount.style.display = session.level === 4 ? 'block' : 'none';
  }
  updateManagementVisibility();
  populateManageStaffSelect();
  renderSelectedStaffManagementInfo(manageStaffUsername ? manageStaffUsername.value : '');
  renderStaffTickets();
  renderWarnings();
  renderBans();
  populateStaffSettings();
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

function handleTicketAction(ticketId, action) {
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
  if (ticketIndex === -1) return;

  if (action === 'resolve') {
    tickets[ticketIndex].status = 'resolved';
    saveTickets(tickets);
    showResponse(staffDashboardMessage, `Ticket ${ticketId} has been marked resolved.`);
  }

  if (action === 'reject-appeal') {
    tickets[ticketIndex].status = 'resolved';
    saveTickets(tickets);
    showResponse(staffDashboardMessage, `Ban appeal ${ticketId} has been rejected.`);
  }

  renderTickets();
  renderStaffTickets();
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
        return;
      }
      openStaffLogin();
    });
  }

  if (staffPanelBtn) {
    staffPanelBtn.addEventListener('click', () => {
      if (window.location.pathname.endsWith('team.html')) {
        const target = document.getElementById('staffDashboard');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.location.href = 'team.html';
      }
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
        updateStaffDashboard();
        if (staffLoginMessage) {
          staffLoginMessage.style.display = 'block';
          staffLoginMessage.textContent = `Logged in as ${sessionData.displayName}.`;
        }
        closeStaffLogin(true);
        return;
      } catch (error) {
        const fallbackSession = getLocalStaffSession(username, password);
        if (fallbackSession) {
          setStaffSession(fallbackSession);
          updateStaffDashboard();
          if (staffLoginMessage) {
            staffLoginMessage.style.display = 'block';
            staffLoginMessage.textContent = `Logged in as ${fallbackSession.displayName} (local fallback).`;
          }
          closeStaffLogin(true);
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
    const suspendSection = document.querySelector('.action-section.action-suspend');
    const teamSection = document.querySelector('.action-section.action-team');

    if (noteSection) noteSection.style.display = action === 'note' || action === 'deactivate' || action === 'reactivate' ? 'grid' : 'none';
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
        if (action === 'suspend') {
          const duration = managementSuspendDuration ? managementSuspendDuration.value : '1 day';
          await apiRequest(`/api/staff/accounts/${encodeURIComponent(username)}`, {
            method: 'PUT',
            body: JSON.stringify({ status: `Suspended (${duration})` })
          });
          showResponse(staffDashboardMessage, `${username} has been suspended for ${duration}.`);
        }
        if (action === 'deactivate') {
          await apiRequest(`/api/staff/accounts/${encodeURIComponent(username)}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'Deactivated' })
          });
          showResponse(staffDashboardMessage, `${username} has been deactivated.`);
        }
        if (action === 'reactivate') {
          await apiRequest(`/api/staff/accounts/${encodeURIComponent(username)}`, {
            method: 'PUT',
            body: JSON.stringify({ status: 'Active' })
          });
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

  if (ticketFilter) {
    ticketFilter.addEventListener('change', () => {
      renderStaffTickets();
    });
  }

  if (ticketClosePresetBtn) {
    ticketClosePresetBtn.addEventListener('click', () => {
      const reason = ticketCloseReason ? ticketCloseReason.value : 'Resolved';
      resolveSelectedTicket(reason);
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
        const tickets = response.tickets || [];
        const account = response.account || findStaffAccount(username);
        let resultHtml = `<div class="record-search-summary"><p><strong>Search results for:</strong> ${username}</p>`;
        resultHtml += `<p><strong>Staff account:</strong> ${account ? account.role : 'Not on staff'}</p>`;
        resultHtml += `<p><strong>Open tickets:</strong> ${tickets.filter(ticket => ticket.status === 'open').length}</p>`;
        resultHtml += `<p><strong>Total tickets:</strong> ${tickets.length}</p></div>`;
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

        const updatedSession = { ...session, password: next };
        setStaffSession(updatedSession);
        showResponse(staffDashboardMessage, 'Password updated successfully.');
        if (currentPassword) currentPassword.value = '';
        if (newPassword) newPassword.value = '';
        if (confirmNewPassword) confirmNewPassword.value = '';
      } catch (error) {
        showResponse(staffDashboardMessage, error.message || 'Unable to update password right now.', true);
      }
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
        const updatedSession = { ...session, email, birthday };
        setStaffSession(updatedSession);
        updateStaffDashboard();
        if (staffSettingsMessage) {
          staffSettingsMessage.style.display = 'block';
          staffSettingsMessage.textContent = 'Your Waypoint settings have been saved.';
        }
      } catch (error) {
        if (staffSettingsMessage) {
          staffSettingsMessage.style.display = 'block';
          staffSettingsMessage.textContent = error.message || 'Unable to save your settings.';
        }
      }
    });
  }

  if (leaveButton) {
    leaveButton.addEventListener('click', async () => {
      const session = getStaffSession();
      if (!session) return;
      try {
        await apiRequest('/api/staff/profile', {
          method: 'POST',
          body: JSON.stringify({ username: session.username, status: 'Leave of Absence' })
        });
        const updatedSession = { ...session, status: 'Leave of Absence' };
        setStaffSession(updatedSession);
        updateStaffDashboard();
        if (staffSettingsMessage) {
          staffSettingsMessage.style.display = 'block';
          staffSettingsMessage.textContent = 'Your staff status has been updated to Leave of Absence.';
        }
      } catch (error) {
        if (staffSettingsMessage) {
          staffSettingsMessage.style.display = 'block';
          staffSettingsMessage.textContent = error.message || 'Unable to update your staff status.';
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
  const usernames = staffMembers.map(member => member.username);
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

    const nameMap = Object.fromEntries(data.data.map(user => [user.requestedUsername.toLowerCase(), user.id]));
    staffMembers.forEach(member => {
      const id = nameMap[member.username.toLowerCase()];
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

if (ticketForm) {
  ticketForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('ticketName').value.trim();
    const email = document.getElementById('ticketEmail').value.trim();
    const subject = document.getElementById('ticketSubject').value.trim();
    const type = document.getElementById('ticketType') ? document.getElementById('ticketType').value : 'General';
    const message = document.getElementById('ticketMessage').value.trim();

    if (!name || !email || !subject || !message) {
      showResponse(ticketResponse, 'Please complete every field before submitting.');
      return;
    }

    const ticketMeta = createTicketId();
    const tickets = getTickets();
    const newTicket = {
      id: ticketMeta.id,
      number: ticketMeta.number,
      url: ticketMeta.url,
      name,
      email,
      subject,
      type,
      status: 'open',
      message,
      createdAt: new Date().toISOString(),
    };

    tickets.unshift(newTicket);
    saveTickets(tickets);
    renderTickets();
    ticketForm.reset();
    showResponse(ticketResponse, `Ticket submitted successfully! Your ticket ID is ${newTicket.id}.`);
    renderStaffTickets();
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
updateStaffDashboard();
renderTickets();
renderTeamCategories();
refreshRobloxUsernames();
