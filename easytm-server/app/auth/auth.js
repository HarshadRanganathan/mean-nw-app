var jwt = require('jsonwebtoken')
var config = require('../../config/config')

exports.getToken = function (req, res) {
  var userId = req.body.userId;
  var token = jwt.sign({ userId: userId }, config.secret, { expiresIn: config.expiresIn });
  res.json({ success: true, token: token, expiresIn: config.expiresIn });
}

exports.verifyToken = function (req, res, next) {
  var authorization = req.headers.authorization;
  if (authorization) {
    var token = authorization.split(' ')[1];
    return jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        if (err.name == "TokenExpiredError") {
          return res.status(400).json({ error: "Token expired" })
        } else if (err.name == "JsonWebTokenError") {
          return res.status(401).json({ error: "Invalid Token" })
        }
      } else if (decoded) {
        next();
      }
    });
  } else {
    return res.status(401).json({ error: "Invalid Token" })
  }
}
