function sessionMiddleware(req, res, next) {
  console.log(req.session);
  return next();
}

exports.sessionMiddleware = sessionMiddleware;
