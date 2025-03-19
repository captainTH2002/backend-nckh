const security = require("../utils/security");
const { responseServerError, responseUnthorized, reponseForbidden } = require("../helper/ResponseRequests");
const requireLogin = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return responseUnthorized({ res });
    } else {
      const headerAuthorized = req.headers.authorization.split(" ")[1];

      const decodedToken = security.verifyToken(headerAuthorized);
      if (decodedToken.user) {
        req.user = decodedToken.user;
        next();
      } else {
        return responseUnthorized({ res });
      }
    }
  } catch (error) {
    console.log(error);
    return responseUnthorized({ res });
  }
};

const requireRole = (...checkRole) => {
  return (req, res, next) => {
    if (req.user.role_id && checkRole.includes(req.user.role_id)) next();
    else {
      return reponseForbidden({ res });
    }
  };
};

module.exports = {
  requireLogin,
  requireRole,
};
