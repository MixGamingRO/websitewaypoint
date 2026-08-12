const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

const defaultState = {
  tickets: [],
  warnings: [],
  bans: [],
  staffAccounts: [
    { username: 'mcrnathan', password: 'ownerpass', displayName: 'mcrnathan', role: 'Owner', level: 4, email: '', birthday: '2000-03-15' },
    { username: 'Rocanti', password: 'managementpass', displayName: 'Rocanti', role: 'Management', level: 3, email: '', birthday: '2000-05-06' },
    { username: 'Chowlty', password: 'managementpass', displayName: 'Chowlty', role: 'Management', level: 3, email: '', birthday: '2000-07-28' },
    { username: 'MixBoss28', password: 'managementpass', displayName: 'MixBoss28', role: 'Management', level: 3, email: '', birthday: '2000-08-12' },
    { username: 'Seby17119', password: 'devpass', displayName: 'Seby17119', role: 'Developer', level: 2, email: '', birthday: '2000-11-02' },
    { username: 'ActualCheddar', password: 'devpass', displayName: 'ActualCheddar', role: 'Developer', level: 2, email: '', birthday: '2000-01-22' }
  ],
  staffProfiles: {},
  staffNotes: {},
  ticketCounter: 0
};

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultState, null, 2));
  }
}

function readStore() {
  ensureStorage();
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      tickets: Array.isArray(parsed.tickets) ? parsed.tickets : [],
      warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
      bans: Array.isArray(parsed.bans) ? parsed.bans : [],
      staffAccounts: Array.isArray(parsed.staffAccounts) && parsed.staffAccounts.length ? parsed.staffAccounts : defaultState.staffAccounts,
      staffProfiles: parsed.staffProfiles && typeof parsed.staffProfiles === 'object' ? parsed.staffProfiles : {},
      staffNotes: parsed.staffNotes && typeof parsed.staffNotes === 'object' ? parsed.staffNotes : {},
      ticketCounter: Number(parsed.ticketCounter) || 0
    };
  } catch (error) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultState, null, 2));
    return { ...defaultState };
  }
}

function writeStore(state) {
  ensureStorage();
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'waypoint-api' });
});

app.get('/api/tickets', (req, res) => {
  const store = readStore();
  res.json({ tickets: store.tickets });
});

app.post('/api/tickets', (req, res) => {
  const { name, email, subject, type, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'name, email, subject, and message are required' });
  }

  const store = readStore();
  const nextNumber = (Number(store.ticketCounter) || 0) + 1;
  const ticket = {
    id: `WP-${String(nextNumber).padStart(4, '0')}`,
    number: nextNumber,
    url: `https://podrblx.co.uk/staff/ticket?ID=${nextNumber}`,
    name,
    email,
    subject,
    type: type || 'General',
    status: 'open',
    message,
    createdAt: new Date().toISOString()
  };

  store.ticketCounter = nextNumber;
  store.tickets.unshift(ticket);
  writeStore(store);
  res.status(201).json({ message: 'Ticket created', ticket });
});

app.get('/api/warnings', (req, res) => {
  const store = readStore();
  res.json({ warnings: store.warnings });
});

app.post('/api/warnings', (req, res) => {
  const { username, reason, evidence, issuedBy } = req.body || {};
  if (!username || !reason || !issuedBy) {
    return res.status(400).json({ error: 'username, reason, and issuedBy are required' });
  }

  const store = readStore();
  const warning = {
    username,
    reason,
    evidence: evidence || '',
    issuedBy,
    createdAt: new Date().toLocaleString()
  };
  store.warnings.unshift(warning);
  writeStore(store);
  res.status(201).json({ message: 'Warning created', warning });
});

app.get('/api/bans', (req, res) => {
  const store = readStore();
  res.json({ bans: store.bans });
});

app.post('/api/bans', (req, res) => {
  const { username, reason, evidence, duration, issuedBy } = req.body || {};
  if (!username || !reason || !issuedBy) {
    return res.status(400).json({ error: 'username, reason, and issuedBy are required' });
  }

  const store = readStore();
  const ban = {
    username,
    reason,
    evidence: evidence || '',
    duration: duration || 'Permanent',
    issuedBy,
    createdAt: new Date().toLocaleString()
  };
  store.bans.unshift(ban);
  writeStore(store);
  res.status(201).json({ message: 'Ban created', ban });
});

app.get('/api/staff/accounts', (req, res) => {
  const store = readStore();
  res.json({ accounts: store.staffAccounts });
});

app.post('/api/staff/accounts', (req, res) => {
  const { username, password, displayName, role, level, email, birthday } = req.body || {};
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'username, password, and role are required' });
  }

  const store = readStore();
  const exists = store.staffAccounts.some(account => account.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'Staff username already exists' });
  }

  const account = {
    username,
    password,
    displayName: displayName || username,
    role,
    level: Number(level) || 3,
    email: email || '',
    birthday: birthday || ''
  };
  store.staffAccounts.push(account);
  writeStore(store);
  res.status(201).json({ message: 'Staff account created', account });
});

app.delete('/api/staff/accounts/:username', (req, res) => {
  const { username } = req.params;
  const store = readStore();
  const account = store.staffAccounts.find(item => item.username.toLowerCase() === username.toLowerCase());

  if (!account) {
    return res.status(404).json({ error: 'Staff account not found' });
  }

  const key = username.toLowerCase();
  store.staffProfiles[key] = { ...(store.staffProfiles[key] || {}), status: 'Resigned' };
  if (store.staffNotes[key]) delete store.staffNotes[key];
  writeStore(store);
  res.json({ message: 'Staff account marked as resigned' });
});

app.put('/api/staff/accounts/:username', (req, res) => {
  const { username } = req.params;
  const { role, password, email, birthday, status } = req.body || {};
  const store = readStore();
  const index = store.staffAccounts.findIndex(account => account.username.toLowerCase() === username.toLowerCase());

  if (index === -1) {
    return res.status(404).json({ error: 'Staff account not found' });
  }

  const account = store.staffAccounts[index];
  if (role !== undefined) account.role = role;
  if (password !== undefined) account.password = password;
  if (email !== undefined) account.email = email;
  if (birthday !== undefined) account.birthday = birthday;

  if (status !== undefined) {
    const key = account.username.toLowerCase();
    store.staffProfiles[key] = { ...(store.staffProfiles[key] || {}), status };
  }

  store.staffAccounts[index] = account;
  writeStore(store);
  res.json({ message: 'Staff account updated', account });
});

app.post('/api/staff/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const store = readStore();
  const account = store.staffAccounts.find(item => item.username.toLowerCase() === username.toLowerCase());
  if (!account || account.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const profile = store.staffProfiles[account.username.toLowerCase()] || {};
  const status = profile.status || 'Active';
  if (status !== 'Active') {
    return res.status(403).json({ error: `Account is ${status}. Login denied.` });
  }

  const session = { ...account, ...profile, status };
  res.json({ message: 'Login successful', session });
});

app.post('/api/staff/password', (req, res) => {
  const { username, currentPassword, newPassword } = req.body || {};
  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'username, currentPassword, and newPassword are required' });
  }

  const store = readStore();
  const account = store.staffAccounts.find(item => item.username.toLowerCase() === username.toLowerCase());
  if (!account || account.password !== currentPassword) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  account.password = newPassword;
  store.staffAccounts = store.staffAccounts.map(item => item.username.toLowerCase() === username.toLowerCase() ? account : item);
  writeStore(store);
  res.json({ message: 'Password updated' });
});

app.get('/api/records', (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'username query is required' });
  }

  const store = readStore();
  const warnings = store.warnings.filter(entry => entry.username.toLowerCase() === String(username).toLowerCase());
  const bans = store.bans.filter(entry => entry.username.toLowerCase() === String(username).toLowerCase());
  const tickets = store.tickets.filter(entry => entry.name.toLowerCase() === String(username).toLowerCase());
  const account = store.staffAccounts.find(entry => entry.username.toLowerCase() === String(username).toLowerCase()) || null;

  res.json({
    username: String(username),
    account,
    warnings,
    bans,
    tickets,
    hasWarnings: warnings.length > 0,
    hasBans: bans.length > 0
  });
});

app.get('/api/check-join', (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'username query is required' });
  }

  const store = readStore();
  const bans = store.bans.filter(entry => entry.username.toLowerCase() === String(username).toLowerCase());
  const warnings = store.warnings.filter(entry => entry.username.toLowerCase() === String(username).toLowerCase());

  if (bans.length > 0) {
    return res.json({
      canJoin: false,
      reason: 'Banned',
      bans,
      warnings,
      username: String(username)
    });
  }

  res.json({
    canJoin: true,
    reason: 'Allowed',
    bans: [],
    warnings,
    username: String(username)
  });
});

app.post('/api/staff/profile', (req, res) => {
  const { username, email, birthday, status } = req.body || {};
  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }

  const store = readStore();
  const key = username.toLowerCase();
  store.staffProfiles[key] = {
    ...(store.staffProfiles[key] || {}),
    ...(email !== undefined ? { email } : {}),
    ...(birthday !== undefined ? { birthday } : {}),
    ...(status !== undefined ? { status } : {})
  };
  writeStore(store);
  res.json({ message: 'Profile updated', profile: store.staffProfiles[key] });
});

app.get('/api/staff/notes/:username', (req, res) => {
  const { username } = req.params;
  const store = readStore();
  const key = username.toLowerCase();
  res.json({ notes: store.staffNotes[key] || [] });
});

app.post('/api/staff/notes', (req, res) => {
  const { username, note, issuedBy } = req.body || {};
  if (!username || !note || !issuedBy) {
    return res.status(400).json({ error: 'username, note, and issuedBy are required' });
  }

  const store = readStore();
  const key = username.toLowerCase();
  store.staffNotes[key] = store.staffNotes[key] || [];
  store.staffNotes[key].unshift({ note, issuedBy, date: new Date().toLocaleString() });
  writeStore(store);
  res.json({ message: 'Note added', notes: store.staffNotes[key] });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Waypoint API running on http://localhost:${PORT}`);
});
