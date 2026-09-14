/**
 * JWT AUTHENTICATION SYSTEM - BACKEND
 * ------------------------------------
 * Demonstrates:
 *   - Password hashing (bcrypt)
 *   - Access token + Refresh token issuance (JWT)
 *   - Stateless session verification via middleware
 *   - Protected routes
 *   - Token refresh flow
 *   - Logout (refresh-token invalidation)
 *
 * Run: npm install && npm start
 * Server listens on http://localhost:5000
 */

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// --- Secrets (in production: load from environment variables / secret manager) ---
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "dev_access_secret_change_me";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "dev_refresh_secret_change_me";
const ACCESS_TOKEN_EXPIRY = "15m";   // short-lived access token
const REFRESH_TOKEN_EXPIRY = "7d";   // longer-lived refresh token

// --- Mock "database" (in-memory user store) ---
// Passwords are stored as bcrypt hashes, never in plaintext.
const users = [];

// In-memory store of currently valid refresh tokens (per user).
// In production this would be a DB table / Redis set, so tokens can be revoked.
let refreshTokenStore = new Set();

// ---------- Helper functions ----------
function generateAccessToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

function generateRefreshToken(user) {
  const token = jwt.sign({ sub: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  refreshTokenStore.add(token);
  return token;
}

// Middleware: verifies the Authorization: Bearer <token> header
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      const message =
        err.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token";
      return res.status(403).json({ message });
    }
    req.user = decoded; // attach decoded claims to the request
    next();
  });
}

// ---------- Routes ----------

// Health check
app.get("/", (req, res) => {
  res.json({ status: "JWT auth server running" });
});

// REGISTER
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
    role: "user",
  };
  users.push(newUser);

  res.status(201).json({ message: "User registered successfully" });
});

// LOGIN -> issues access + refresh tokens
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.json({
    message: "Login successful",
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username, role: user.role },
  });
});

// REFRESH -> exchange a valid refresh token for a new access token
app.post("/api/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });
  if (!refreshTokenStore.has(refreshToken)) {
    return res.status(403).json({ message: "Refresh token invalid or revoked" });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Refresh token invalid or expired" });

    const user = users.find((u) => u.id === decoded.sub);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  });
});

// LOGOUT -> revoke refresh token
app.post("/api/logout", (req, res) => {
  const { refreshToken } = req.body;
  refreshTokenStore.delete(refreshToken);
  res.json({ message: "Logged out successfully" });
});

// PROTECTED ROUTE -> requires valid access token
app.get("/api/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Protected data fetched successfully",
    user: req.user, // decoded JWT payload (stateless session info)
  });
});

app.listen(PORT, () => {
  console.log(`JWT auth server listening on http://localhost:${PORT}`);
});
