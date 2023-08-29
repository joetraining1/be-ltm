const jwt = require("jsonwebtoken");
const { cookieParser } = require("../utils/CookieParser");

exports.JWTController = {
  createToken(payload, refresh = false) {
    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: 10800,
    });

    return {
      access_token: accessToken,
      refresh_token: refresh
        ? jwt.sign(payload, process.env.SECRET, {
            expiresIn: 30 * 24 * 60 * 60,
          })
        : null,
    };
  },

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      return decoded;
    } catch (e) {
      return false;
    }
  },

  verifyAccessToken(req, res, next) {
    const headers = req.headers;
    if (!headers["authorization"]) {
      return res.status(405).json({ message: "token are not provided." });
    }

    const token = headers["authorization"].split(" ")[1];

    if (!this.verifyToken(token)) {
      return res.status(405).json({ message: "invalid token." });
    } else next();
  },

  grantNewAccessToken(req, res) {
    const token = cookieParser("refreshToken", req.headers.cookie);
    let decoded = this.verifyToken(token);
    if (!decoded) res.status(405).json({ message: "invalid token" });
    else {
      console.log(decoded, "here result of decoded");
      let newToken = this.createToken({ email: decoded.email }, false);
      res.send({ access_token: newToken.access_token });
    }
  },
};
