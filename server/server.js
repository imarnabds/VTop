import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3080;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/vtop', {
}).then(() => {
  console.log('Connected to MongoDB local instance (vtop)');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// User Schema & Model
const sessionSchema = new mongoose.Schema({
  loginTime: { type: Date, default: Date.now },
  logoutTime: { type: Date, default: null }
});

const userSchema = new mongoose.Schema({
  id: String,
  name: { type: String, required: true },
  regNum: { type: String, required: true, unique: true },
  email: String,
  mobile: String,
  password: { type: String, required: true }, // Store as plain text only for local testing simulation
  department: String,
  gender: String,
  dob: String,
  applicationNo: String,
  lastLoginTime: { type: Date, default: null },
  lastLogoutTime: { type: Date, default: null },
  sessionLogs: [sessionSchema]
});

const User = mongoose.model('User', userSchema);

// Reference database paths for standard mock data
const dataPath = path.join(__dirname, 'data.json');

// Memory storages
let database = {};

// Helper functions for reading local JSON databases (only for dynamic module structure now)
const loadData = () => {
  try {
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    database = JSON.parse(fileContent);
  } catch (err) {
    console.error('Failed to load data.json', err);
  }
};

loadData();

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');


/* 
  AUTHENTICATION ENDPOINTS 
*/
app.post('/api/auth/register', async (req, res) => {
  const { name, regNum, email, mobile, password, department, gender, dob } = req.body;
  
  if (!name || !regNum || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Check if regNum already exists
    const existingUser = await User.findOne({ regNum });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User with this Registration Number already exists' });
    }

    const newUser = new User({
      id: Date.now().toString(),
      name,
      regNum,
      email,
      mobile,
      password, // Plain text as per original mock
      department,
      gender,
      dob,
      applicationNo: `202${Math.floor(Math.random() * 90000) + 10000}`, // Mock application number generator
      sessionLogs: []
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'Registration successful. You can log in now.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ regNum: username, password });
    
    if (user) {
      // Record login timestamp at top level and in session log
      const now = new Date();
      user.lastLoginTime = now;
      user.sessionLogs.push({ loginTime: now });
      await user.save();
      
      // Get the newly created session id (last inserted)
      const currentSession = user.sessionLogs[user.sessionLogs.length - 1];
      const sessionId = currentSession._id;

      // Exclude password from the returned object token
      const userObj = user.toObject();
      delete userObj.password;
      
      res.json({ 
        success: true, 
        message: 'Logged in successfully', 
        user: { ...userObj, sessionId }, // include sessionId in client response
        token: user.regNum,
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your Registration Number and Password.' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  const { regNum, sessionId } = req.body;
  if (!regNum || !sessionId) {
     return res.status(400).json({ success: false, message: 'Requires regNum and sessionId' });
  }

  try {
    const user = await User.findOne({ regNum });
    if (!user) {
       return res.status(404).json({ success: false, message: 'User not found' });
    }

    const session = user.sessionLogs.id(sessionId);
    if (session) {
      const now = new Date();
      session.logoutTime = now;
      user.lastLogoutTime = now;
      await user.save();
      return res.json({ success: true, message: 'Logged out successfully and timestamp recorded' });
    } else {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ success: false, message: 'Server error during logout' });
  }
});


/* 
  DYNAMIC DASHBOARD MODULE ENGINE 
*/
app.get('/api/module/:category/:submenu', async (req, res) => {
  const { category, submenu } = req.params;
  const regNumHeader = req.headers['authorization'] || ''; 
  
  const categorySlug = slugify(category);
  const submenuSlug = slugify(submenu);
  
  let tokenMatchedUser = null;
  if (regNumHeader) {
      try {
         tokenMatchedUser = await User.findOne({ regNum: regNumHeader });
      } catch (err) {
         console.error("DB Match error:", err);
      }
  }

  console.log(`[API Request] Cat: ${categorySlug}, Sub: ${submenuSlug}, User: ${tokenMatchedUser?.name || 'Guest'}`);

  // Fetch statically defined structure
  let payloadStructure = database[categorySlug]?.[submenuSlug];

  // Dynamic Hooks for specific pages
  if (categorySlug === 'my-info' && submenuSlug === 'profile') {
    if (tokenMatchedUser) {
      // Return a dynamically assembled profile payload utilizing the user's registered details!
      return res.json({
        success: true,
        payload: {
          title: "My Profile Information",
          type: "card",
          data: {
            "Application No.": tokenMatchedUser.applicationNo || "Unknown",
            "Registration Number": tokenMatchedUser.regNum,
            "Student Name": tokenMatchedUser.name,
            "Date of Birth": tokenMatchedUser.dob || "Unknown",
            "Gender": tokenMatchedUser.gender || "Unknown",
            "Department / School": tokenMatchedUser.department || "Unknown",
            "Contact Email": tokenMatchedUser.email || "Unknown"
          }
        }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Unauthorized. Real user details cannot be loaded without logging in.' });
    }
  }

  // Generic processing 
  if (payloadStructure) {
    return res.json({ success: true, payload: payloadStructure });
  }

  // Fallback Generation
  res.json({
    success: true,
    payload: {
      title: submenu.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      type: "placeholder",
      message: `The backend structure for '${submenu}' under '${category}' is currently not defined in data.json.`
    }
  });
});

app.listen(PORT, () => {
  console.log(`Independent Authentication & Backend Server running on http://localhost:${PORT}`);
});
