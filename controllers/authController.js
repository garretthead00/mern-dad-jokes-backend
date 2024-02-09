require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUsers, getUserWithEmail } = require("../services/userService");

const login = async (req, res) => {
  console.log('login user ', req.body)
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: "Missing required login fields" });
  }

  const user = await getUserWithEmail(email);
  if (!user) {
    res.status(401).json({ message: "No user found." });
  }

  const match = password == user.password; //await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(400).json({ message: "Unauthorized. Mismatched password." });
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: user.username,
        roles: user.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    {
      username: user.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only on webserver
    secure: true, // forces https
    sameSite: "None", // cross-site cookie
    maxAge: 24 * 60 * 60 * 1000, // cookie expiry: set to match refreshToken expiry
  });

  res.json({ accessToken });
};

const refresh = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;

  // Verify the refresh token and grant a new access token
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const user = await getUser({ username: decoded.username });
      if (!user)
        return res
          .status(401)
          .json({ message: "Unauthorized. No User found." });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: user.username,
            roles: user.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ accessToken });
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) res.status(402);

  res.clearCookie("jwt", {
    httpOnly: true, // accessible only on webserver
    secure: true, // forces https
    sameSite: "None", // cross-site cookie
  });
  res.json({ message: "Cookie cleared" });
};

module.exports = {
  login,
  logout,
  refresh,
};
