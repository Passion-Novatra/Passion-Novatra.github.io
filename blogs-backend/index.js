require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors({
  origin: ['https://passion-novatra.github.io', 'http://localhost:4321'],
  credentials: true
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'https://passion-novatra.github.io/admin/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
  const org = process.env.GITHUB_ORG;
  const res = await fetch(`https://api.github.com/orgs/${org}/members/${profile.username}`, {
    headers: { Authorization: `token ${accessToken}` }
  });
  if (res.status !== 204) return done(null, false, { message: '非组织成员' });
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get('/admin/login', (req, res) => res.render('login'));
app.get('/admin/auth/github', passport.authenticate('github', { scope: ['read:org'] }));
app.get('/admin/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/admin/login' }),
  (req, res) => res.redirect('/admin/dashboard')
);

app.get('/admin/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/admin/login');
  res.send('欢迎进入后台管理，' + req.user.displayName);
});

app.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Backend running at http://10.211.55.10:${process.env.PORT}/admin/login`);
});