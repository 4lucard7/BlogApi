const jwt = require("jsonwebtoken");

// verify token
function verfiyToken(req, res, next) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authToken.split(" ")[1];

    try {
        const decodedPayload = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedPayload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token, access denied" });
    }
}

// verify token and admin
function verfiyTokenAndAdmin(req, res, next) {
    verfiyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "not allowed only admin" });
        }
    });
}

// verify token and only user himself
function verfiyTokenAndOnlyUser(req, res, next) {
    verfiyToken(req, res, () => {
        if (req.user.id === req.params.id) {
            next();
        } else {
            return res.status(403).json({ message: "not allowed only user himself" });
        }
    });
}

module.exports = {
    verfiyToken,
    verfiyTokenAndAdmin,
    verfiyTokenAndOnlyUser
};
