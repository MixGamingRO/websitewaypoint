const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// ---------------------------------------------------------------------------
// PERSISTENCE
//
// IMPORTANT: Render's Free web services have an EPHEMERAL filesystem. Any
// file this process writes (like data/store.json) is wiped every time the
// service redeploys, restarts, or spins down from inactivity. That is why
// passwords / emails / bans / deactivations were reverting to the hardcoded
// defaults below - the file kept getting recreated from `defaultState`.
//
// Fix: if a MONGODB_URI environment variable is set, all reads/writes go to
// a MongoDB collection instead, which survives restarts and redeploys. If no
// MONGODB_URI is set, we fall back to the local JSON file so local
// development still works, but we log a loud warning because that mode will
// NOT survive a Render restart.
//
// To make this permanent on Render (free):
//   1. Create a free MongoDB Atlas cluster (mongodb.com/cloud/atlas) - no
//      credit card required, 512MB free forever.
//   2. Grab the connection string (Database Access -> connect -> Node.js).
//   3. In the Render dashboard, add an environment variable MONGODB_URI with
//      that connection string to this service.
//   4. Redeploy. From then on all data (accounts, warnings, bans,
//      staff status/email/birthday) persists across restarts.
// ---------------------------------------------------------------------------

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'waypoint';
let mongoCollection = null;

const defaultState = {
  warnings: [],
  bans: [],
  leaveRequests: [],
  staffAccounts: [
    { username: 'mcrnathan', password: 'ownerpass', displayName: 'mcrnathan', role: 'Owner', level: 4, email: '', birthday: '2000-03-15' },
    { username: 'Rocanti', password: 'managementpass', displayName: 'Rocanti', role: 'Management', level: 3, email: '', birthday: '2000-05-06' },
    { username: 'Chowlty', password: 'managementpass', displayName: 'Chowlty', role: 'Management', level: 3, email: '', birthday: '2000-07-28' },
    { username: 'MixBoss28', password: 'managementpass', displayName: 'MixBoss28', role: 'Management', level: 3, email: '', birthday: '2000-08-12' },
    { username: 'xDeveloper_Jacobx', password: 'managementpass', displayName: 'xDeveloper_Jacobx', role: 'Management', level: 3, email: '', birthday: '2000-06-10' },
    { username: 'Vivacion', password: 'devpass', displayName: 'Vivacion', role: 'Senior Developer', level: 2, email: '', birthday: '2000-04-22' },
    { username: 'Seby17119', password: 'devpass', displayName: 'Seby17119', role: 'Developer', level: 2, email: '', birthday: '2000-11-02' },
    { username: 'ActualCheddar', password: 'devpass', displayName: 'ActualCheddar', role: 'Developer', level: 2, email: '', birthday: '2000-01-22' }
  ],
  staffProfiles: {},
  staffNotes: {},
  playerNotes: {},
  banApprovals: {},
  siteSettings: {
    announcement: '',
    siteOnline: true,
    allowLogins: true,
    allowSignups: true,
    allowPostCreation: true,
    allowTrades: true,
    allowReports: true,
    allowPasswordReset: true,
    disabledFeatures: []
  }
};

function normalizeState(parsed) {
  return {
    ...defaultState,
    ...parsed,
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
    bans: Array.isArray(parsed.bans) ? parsed.bans : [],
    staffAccounts: Array.isArray(parsed.staffAccounts) && parsed.staffAccounts.length ? parsed.staffAccounts : defaultState.staffAccounts,
    staffProfiles: parsed.staffProfiles && typeof parsed.staffProfiles === 'object' ? parsed.staffProfiles : {},
    staffNotes: parsed.staffNotes && typeof parsed.staffNotes === 'object' ? parsed.staffNotes : {},
    playerNotes: parsed.playerNotes && typeof parsed.playerNotes === 'object' ? parsed.playerNotes : {},
    banApprovals: parsed.banApprovals && typeof parsed.banApprovals === 'object' ? parsed.banApprovals : {},
    leaveRequests: Array.isArray(parsed.leaveRequests) ? parsed.leaveRequests : [],
    siteSettings: parsed.siteSettings && typeof parsed.siteSettings === 'object' ? { ...defaultState.siteSettings, ...parsed.siteSettings } : defaultState.siteSettings
  };
}

// In-memory cache. Every route reads/writes this synchronously (unchanged
// from before), and writeStore() below fans the change out to whichever
// backend is active.
let storeCache = null;

function ensureLocalFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultState, null, 2));
  }
}

function loadFromFileSync() {
  ensureLocalFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    const fresh = { ...defaultState };
    fs.writeFileSync(DATA_FILE, JSON.stringify(fresh, null, 2));
    return fresh;
  }
}

function persistToFileSync(state) {
  ensureLocalFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2));
}

async function initStorage() {
  if (MONGODB_URI) {
    try {
      // Lazily require so a missing dependency doesn't crash apps that
      // don't use Mongo. Run `npm install` after pulling these changes so
      // the `mongodb` package (added to package.json) is available.
      const { MongoClient } = require('mongodb');
      const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
      await client.connect();
      const db = client.db(MONGODB_DB);
      mongoCollection = db.collection('store');

      const existing = await mongoCollection.findOne({ _id: 'singleton' });
      if (existing) {
        const { _id, ...rest } = existing;
        storeCache = normalizeState(rest);
      } else {
        storeCache = { ...defaultState };
        await mongoCollection.updateOne(
          { _id: 'singleton' },
          { $set: storeCache },
          { upsert: true }
        );
      }
      console.log('[storage] Connected to MongoDB - data will persist across restarts and deploys.');
    } catch (error) {
      console.error('[storage] MONGODB_URI was set but connection failed. Falling back to the local file, which will NOT persist on Render free tier. Error:', error.message);
      mongoCollection = null;
      storeCache = loadFromFileSync();
    }
  } else {
    console.warn('[storage] No MONGODB_URI set. Using the local JSON file for storage.');
    console.warn('[storage] On Render (and most hosts), this file is wiped on every restart/redeploy/spin-down.');
    console.warn('[storage] Set a MONGODB_URI environment variable to make data persist. See comments at the top of server.js.');
    storeCache = loadFromFileSync();
  }
}

function readStore() {
  // Return the live in-memory object; callers mutate it directly and then
  // call writeStore(), matching the previous file-based API.
  return storeCache;
}

function writeStore(state) {
  storeCache = state;
  // Always keep a local copy too (best-effort, synchronous) so a same-process
  // restart or local dev without Mongo still has the latest data available.
  try {
    persistToFileSync(state);
  } catch (error) {
    console.error('[storage] Failed to write local backup file:', error.message);
  }

  if (mongoCollection) {
    mongoCollection
      .updateOne({ _id: 'singleton' }, { $set: state }, { upsert: true })
      .catch(error => {
        console.error('[storage] Failed to persist to MongoDB:', error.message);
      });
  }
}

// Helper function to generate random password
function generateRandomPassword(length = 12) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// Helper function to check if staff member has management level or above
function isManagementOrAbove(levelOrRole) {
  const level = typeof levelOrRole === 'number' ? levelOrRole : 0;
  return level >= 3;
}

// Helper function to check if staff member is senior or above
function isSeniorOrAbove(levelOrRole) {
  const level = typeof levelOrRole === 'number' ? levelOrRole : 0;
  return level >= 2;
}

// Helper function to convert role name to level
function getRoleLevel(role) {
  const roleMap = {
    'Developer': 2,
    'Senior Developer': 2,
    'Management': 3,
    'Owner': 4
  };
  return roleMap[role] || 0;
}

// Helper to check if issuer can manage target
function canManageRole(issuerLevel, targetLevel) {
  // Only management (3) and above can manage others
  if (issuerLevel < 3) {
    return false;
  }
  // Can only manage roles strictly below their level
  return issuerLevel > targetLevel;
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

app.get('/staff', (req, res) => {
  res.sendFile(path.join(__dirname, 'staff.html'));
});

app.get('/staff.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'staff.html'));
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'waypoint-api', storage: mongoCollection ? 'mongodb' : 'local-file (not persistent on Render free tier)' });
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
    id: `ban-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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

app.delete('/api/bans/:id', (req, res) => {
  const { id } = req.params;
  const { issuedBy, issuerLevel } = req.body || {};
  if (!issuedBy || Number(issuerLevel) < 3) {
    return res.status(403).json({ error: 'Only management and above can revoke bans' });
  }

  const store = readStore();
  const banIndex = store.bans.findIndex(item => item.id === id);
  if (banIndex === -1) {
    return res.status(404).json({ error: 'Ban not found' });
  }

  const [removedBan] = store.bans.splice(banIndex, 1);
  writeStore(store);
  res.json({ message: 'Ban revoked', ban: removedBan });
});

app.get('/api/staff/accounts', (req, res) => {
  const store = readStore();
  res.json({ accounts: store.staffAccounts });
});

app.get('/api/staff/profiles', (req, res) => {
  const store = readStore();
  res.json({ profiles: store.staffProfiles || {} });
});

app.get('/api/staff/loa', (req, res) => {
  const store = readStore();
  res.json({ requests: Array.isArray(store.leaveRequests) ? store.leaveRequests : [] });
});

app.post('/api/staff/loa', (req, res) => {
  const { username, displayName, reason, startDate, endDate, issuedBy, status } = req.body || {};
  if (!username || !reason || !startDate || !endDate) {
    return res.status(400).json({ error: 'username, reason, startDate, and endDate are required' });
  }

  const store = readStore();
  const request = {
    id: `loa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    username,
    displayName: displayName || username,
    reason,
    startDate,
    endDate,
    requestedBy: issuedBy || username,
    status: status || 'Pending',
    createdAt: new Date().toISOString(),
    reviewedBy: '',
    reviewedAt: '',
    reviewNote: ''
  };

  store.leaveRequests = [request, ...(Array.isArray(store.leaveRequests) ? store.leaveRequests : [])];
  writeStore(store);
  res.status(201).json({ message: 'Leave request submitted', request });
});

app.put('/api/staff/loa/:id', (req, res) => {
  const { id } = req.params;
  const { status, reviewedBy, reviewNote, reviewerLevel } = req.body || {};

  if (!status || !reviewedBy) {
    return res.status(400).json({ error: 'status and reviewedBy are required' });
  }

  if (Number(reviewerLevel) < 3) {
    return res.status(403).json({ error: 'Only management and above can review LOA requests' });
  }

  const store = readStore();
  const request = (store.leaveRequests || []).find(item => item.id === id);
  if (!request) {
    return res.status(404).json({ error: 'Leave request not found' });
  }

  request.status = status;
  request.reviewedBy = reviewedBy;
  request.reviewedAt = new Date().toISOString();
  request.reviewNote = reviewNote || '';

  if (status === 'Approved') {
    const staffProfile = store.staffProfiles[request.username.toLowerCase()] || {};
    store.staffProfiles[request.username.toLowerCase()] = { ...staffProfile, status: 'Leave of Absence' };
    const account = store.staffAccounts.find(item => item.username.toLowerCase() === request.username.toLowerCase());
    if (account) {
      account.status = 'Leave of Absence';
    }
  } else if (status === 'Denied') {
    const staffProfile = store.staffProfiles[request.username.toLowerCase()] || {};
    store.staffProfiles[request.username.toLowerCase()] = { ...staffProfile, status: 'Active' };
    const account = store.staffAccounts.find(item => item.username.toLowerCase() === request.username.toLowerCase());
    if (account) {
      account.status = 'Active';
    }
  }

  writeStore(store);
  res.json({ message: 'Leave request updated', request });
});

app.get('/api/staff/loa/history/:username', (req, res) => {
  const { username } = req.params;
  const store = readStore();
  const filtered = (store.leaveRequests || []).filter(item => item.username.toLowerCase() === username.toLowerCase());
  res.json({ requests: filtered });
});

app.post('/api/staff/accounts', (req, res) => {
  const { username, password, displayName, role, level, email, birthday, issuedBy, issuerLevel } = req.body || {};
  if (!username || !role) {
    return res.status(400).json({ error: 'username and role are required' });
  }

  // Only management and above can create staff accounts
  if (!isManagementOrAbove(issuerLevel)) {
    return res.status(403).json({ error: 'Only management and above can create staff accounts' });
  }

  // Can't create accounts at or above your own level
  const newAccountLevel = Number(level) || getRoleLevel(role) || 3;
  if (newAccountLevel >= issuerLevel) {
    return res.status(403).json({ error: 'Cannot create accounts at or above your own level' });
  }

  const store = readStore();
  const exists = store.staffAccounts.some(account => account.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'Staff username already exists' });
  }

  // Auto-generate password if not provided
  const generatedPassword = password || generateRandomPassword();
  
  const account = {
    username,
    password: generatedPassword,
    displayName: displayName || username,
    role,
    level: newAccountLevel,
    email: email || '',
    birthday: birthday || ''
  };
  store.staffAccounts.push(account);
  writeStore(store);
  
  // Return password to client in response for LMS message
  res.status(201).json({ 
    message: 'Staff account created', 
    account: { ...account }, 
    generatedPassword 
  });
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
  const { role, password, email, birthday, status, issuedBy, issuerLevel } = req.body || {};
  
  const store = readStore();
  const index = store.staffAccounts.findIndex(account => account.username.toLowerCase() === username.toLowerCase());

  if (index === -1) {
    return res.status(404).json({ error: 'Staff account not found' });
  }

  const account = store.staffAccounts[index];
  
  // Only management and above can update staff accounts
  if (!isManagementOrAbove(issuerLevel)) {
    return res.status(403).json({ error: 'Only management and above can update staff accounts' });
  }

  // Can't modify accounts at or above your own level
  if (account.level >= issuerLevel) {
    return res.status(403).json({ error: 'Cannot modify accounts at or above your own level' });
  }

  // If trying to change role, validate the new role isn't at or above issuer level
  if (role !== undefined) {
    const newRoleLevel = getRoleLevel(role);
    if (newRoleLevel >= issuerLevel) {
      return res.status(403).json({ error: 'Cannot assign roles at or above your own level' });
    }
    account.role = role;
    account.level = newRoleLevel;
  }

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
  const account = store.staffAccounts.find(entry => entry.username.toLowerCase() === String(username).toLowerCase()) || null;

  res.json({
    username: String(username),
    account,
    warnings,
    bans,
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

// Player notes (separate from staff notes - for recording info about players)
app.get('/api/player/notes/:username', (req, res) => {
  const { username } = req.params;
  const store = readStore();
  const key = username.toLowerCase();
  res.json({ notes: store.playerNotes[key] || [] });
});

app.post('/api/player/notes', (req, res) => {
  const { username, note, issuedBy, issuerLevel } = req.body || {};
  if (!username || !note || !issuedBy) {
    return res.status(400).json({ error: 'username, note, and issuedBy are required' });
  }

  // Only senior staff and above can add notes
  if (!isSeniorOrAbove(issuerLevel)) {
    return res.status(403).json({ error: 'Only senior staff and above can add player notes' });
  }

  const store = readStore();
  const key = username.toLowerCase();
  store.playerNotes[key] = store.playerNotes[key] || [];
  store.playerNotes[key].unshift({ note, issuedBy, date: new Date().toLocaleString() });
  writeStore(store);
  res.json({ message: 'Player note added', notes: store.playerNotes[key] });
});

// Reset another staff member's password (management only)
app.put('/api/staff/reset-password', (req, res) => {
  const { targetUsername, issuedBy, issuerLevel } = req.body || {};
  if (!targetUsername || !issuedBy) {
    return res.status(400).json({ error: 'targetUsername and issuedBy are required' });
  }

  // Only management and above can reset passwords
  if (!isManagementOrAbove(issuerLevel)) {
    return res.status(403).json({ error: 'Only management and above can reset passwords' });
  }

  const store = readStore();
  const index = store.staffAccounts.findIndex(account => account.username.toLowerCase() === targetUsername.toLowerCase());

  if (index === -1) {
    return res.status(404).json({ error: 'Staff account not found' });
  }

  const newPassword = generateRandomPassword();
  store.staffAccounts[index].password = newPassword;
  writeStore(store);
  res.json({ 
    message: 'Password reset', 
    account: store.staffAccounts[index],
    newPassword,
    resetBy: issuedBy
  });
});

// Ban approval system (for bans over 7 days requiring senior approval)
app.put('/api/bans/:id/approval', (req, res) => {
  const { id } = req.params;
  const { approved, approvedBy, approverLevel } = req.body || {};
  
  if (approved === undefined || !approvedBy) {
    return res.status(400).json({ error: 'approved and approvedBy are required' });
  }

  // Only senior staff and above can approve bans
  if (!isSeniorOrAbove(approverLevel)) {
    return res.status(403).json({ error: 'Only senior staff and above can approve bans' });
  }

  const store = readStore();
  const ban = store.bans.find(b => b.id === id);

  if (!ban) {
    return res.status(404).json({ error: 'Ban not found' });
  }

  // Check if ban is over 7 days old
  const banDate = new Date(ban.createdAt);
  const now = new Date();
  const daysOld = (now - banDate) / (1000 * 60 * 60 * 24);

  if (daysOld < 7) {
    return res.status(400).json({ error: 'Only bans older than 7 days require approval' });
  }

  const key = id;
  store.banApprovals[key] = {
    banId: id,
    approved,
    approvedBy,
    approvalDate: new Date().toLocaleString()
  };
  writeStore(store);
  res.json({ message: 'Ban approval recorded', approval: store.banApprovals[key] });
});

// Site settings (for seniors/management)
app.get('/api/settings', (req, res) => {
  const store = readStore();
  res.json({ settings: store.siteSettings });
});

app.put('/api/settings', (req, res) => {
  const { announcement, siteOnline, allowLogins, allowSignups, allowPostCreation, allowTrades, allowReports, allowPasswordReset, issuerLevel } = req.body || {};
  
  // Only senior staff and above can change settings
  if (!isSeniorOrAbove(issuerLevel)) {
    return res.status(403).json({ error: 'Only senior staff and above can modify site settings' });
  }

  const store = readStore();
  if (announcement !== undefined) store.siteSettings.announcement = announcement;
  if (siteOnline !== undefined) store.siteSettings.siteOnline = siteOnline;
  if (allowLogins !== undefined) store.siteSettings.allowLogins = allowLogins;
  if (allowSignups !== undefined) store.siteSettings.allowSignups = allowSignups;
  if (allowPostCreation !== undefined) store.siteSettings.allowPostCreation = allowPostCreation;
  if (allowTrades !== undefined) store.siteSettings.allowTrades = allowTrades;
  if (allowReports !== undefined) store.siteSettings.allowReports = allowReports;
  if (allowPasswordReset !== undefined) store.siteSettings.allowPasswordReset = allowPasswordReset;

  writeStore(store);
  res.json({ message: 'Settings updated', settings: store.siteSettings });
});

// NOTE: previously this was `app.get('*', ...)` sending index.html for ANY
// unmatched route. That meant a stale/incorrect link silently rendered the
// homepage markup with broken relative asset paths instead of a real 404.
// Real pages are plain files served by express.static above, so unmatched
// routes should 404 instead.
app.use((req, res) => {
  res.status(404).type('html').send('<h1>404 - Page not found</h1><p><a href="/index.html">Go home</a></p>');
});

initStorage()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Waypoint API running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize storage, starting anyway with defaults:', error);
    storeCache = { ...defaultState };
    app.listen(PORT, () => {
      console.log(`Waypoint API running on http://localhost:${PORT}`);
    });
  });
