const axios = require("axios");
const { getUid } = require("../utils/utils");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    if (req.headers.auth) req.headers.authorization = req.headers.auth;
    const token = req.headers.authorization || "";

    req.userId = await getUid(token);
    if (req.userId === undefined)
      return res.status(401).json({ message: "Auth error: unvalid token" });

    if (!req.userId) {
      return res.status(401).json({ message: "Auth error: unvalid token" });
    }

    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: "Auth error" });
  }
};
